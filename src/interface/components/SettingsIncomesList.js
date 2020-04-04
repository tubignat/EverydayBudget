import React, { Component } from 'react';
import { IconButton } from './IconButton';
import { View, Text, TextInput, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import AmountInput from './TextInputWithTemporaryInvalidValue';
import { TextButton } from './TextButton';
import { ApplicationContext } from '../ApplicationContext';

export class IncomesList extends Component {

    static contextType = ApplicationContext;

    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
            fontSizeAnim: new Animated.Value(1),
            fadeAnim: new Animated.Value(this.props.incomes.length === 0 ? 1 : 0)
        };
    }

    render() {
        const { locale } = this.context;

        return <View style={styles.incomesList}>
            {
                <Animated.View style={{
                    ...styles.emptyListTextContainer,
                    zIndex: this.props.incomes.length === 0 ? 100 : 0
                }}>
                    <Animated.Text style={{
                        ...styles.emptyListText,
                        opacity: this.state.fadeAnim
                    }}>
                        {this.props.thereAreNoValuesYetText}
                    </Animated.Text>
                    <View style={{ opacity: this.props.incomes.length === 0 ? 1 : 0 }}>
                        <TextButton forwardedRef={ref => this.addButonRef = ref} text={locale.add} height={50} fontSize={15} onPress={this.onAdd} />
                    </View>
                </Animated.View>
            }
            <View style={{ minHeight: 70 }}>
                {
                    this.props.incomes.map((i) =>
                        <IncomeView
                            locale={locale}
                            key={i.id}
                            income={i}
                            onRemoveButtonPressed={() => this.props.onRemove(i.id)}
                            onAmountChanged={(amount) => this.props.onAmountChanged(i.id, amount)}
                            onDescriptionChanged={(description) => this.props.onDescriptionChanged(i.id, description)}
                            onRemoveAnimationStart={this.onRemoveAnimationStart}
                        />
                    )
                }
                {
                    this.props.incomes.length > 0 &&
                    <Animated.View style={{
                        ...styles.addButton,
                        transform: [
                            { translateX: this.state.moveAnim },
                            { scaleX: this.state.fontSizeAnim },
                            { scaleY: this.state.fontSizeAnim }]
                    }}>
                        <TextButton forwardedRef={ref => this.addButtonRef2 = ref} text={locale.add} height={48} fontSize={18} onPress={this.props.onAdd} />
                    </Animated.View>
                }
            </View>
        </View>
    }

    onAdd = () => {

        this.addButonRef.measure((fx, fy, width, height, px) => {
            this.state.moveAnim.setValue(px - 40 - 24);
            this.state.fontSizeAnim.setValue(0.85);
            this.state.fadeAnim.setValue(1);
            Animated
                .parallel([
                    Animated.timing(this.state.moveAnim, { toValue: 0, duration: 150 }),
                    Animated.timing(this.state.fontSizeAnim, { toValue: 1, duration: 150 }),
                    Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 75 })
                ])
                .start();

            this.props.onAdd();
        });
    }

    onRemoveAnimationStart = () => {
        if (this.props.incomes.length === 1) {
            this.addButonRef.measure((fx, fy, width, height, px) => {

                this.addButtonRef2.measure((fx, fy, width, height, px2) => {

                    const toValue = this.context.language === 'ru' ? px - px2 - 4 : px - px2;
                    Animated
                        .parallel([
                            Animated.timing(this.state.moveAnim, { toValue: toValue, duration: 150 }),
                            Animated.timing(this.state.fontSizeAnim, { toValue: 0.85, duration: 150 }),
                        ])
                        .start();
                    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 600 }).start();
                })
            })
        }
    }
}

class IncomeView extends Component {

    static contextType = ApplicationContext;

    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),
            expandAnim: new Animated.Value(0)
        };

        this.textInputRef = React.createRef();

        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 150 }).start();
        Animated.timing(this.state.expandAnim, { toValue: 52, duration: 150 }).start();
    }

    render() {
        const { locale, currency } = this.context;

        return <Animated.View style={{
            ...styles.incomeView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <TouchableWithoutFeedback onPress={() => this.textInputRef.focus()}>
                <View style={styles.incomeViewAmount}>
                    <AmountInput
                        forwardedRef={ref => this.textInputRef = ref}
                        style={styles.incomeViewAmountText}
                        value={this.props.income.amount}
                        onChange={(newAmount) => this.props.onAmountChanged(newAmount)}
                    />
                    <Text style={styles.incomeViewAmountText}> {currency}</Text>
                </View>
            </TouchableWithoutFeedback>
            <TextInput
                style={styles.incomeViewText}
                onChangeText={this.props.onDescriptionChanged}
                value={this.props.income.description}
                selectTextOnFocus
                placeholder={locale.description}
            />
            <Animated.View style={{
                ...styles.removeButtonContainer,
                opacity: this.state.fadeAnim,
                transform: [{ scaleX: this.state.fadeAnim }, { scaleY: this.state.fadeAnim }]
            }}>
                <IconButton size={52} innerSize={20} icon='close-circle' color='rgb(255, 69, 58)'
                    onPress={this.onRemove} />
            </Animated.View>
        </Animated.View>
    }

    onRemove = () => {
        this.props.onRemoveAnimationStart();
        Animated.parallel([
            Animated.timing(this.state.expandAnim, { toValue: 0, duration: 200 }),
            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 150 }),
        ])
            .start(this.props.onRemoveButtonPressed)
    }
}


const styles = StyleSheet.create({
    incomesList: {
        position: 'relative',
        width: '100%',
        marginBottom: 43
    },
    addButton: {
        marginTop: 16,
        flexDirection: 'row',
        width: 96,
        justifyContent: 'flex-end',
    },
    incomeView: {
        flexDirection: 'row',
        height: 52,
    },
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        marginTop: 16
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15,
    },
    incomeViewText: {
        fontSize: 20,
        flexGrow: 2,
        flexShrink: 1,
    },
    incomeViewAmount: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        width: 96,
        marginRight: 16
    },
    incomeViewAmountText: {
        fontSize: 20,
    },
    removeButtonContainer: {
    },
});