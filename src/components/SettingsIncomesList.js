import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { View, Text, TextInput, Animated, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import AmountInput from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from '../components/TextButton';
import { ApplicationContext } from '../domain/ApplicationContext';

const isSmallScreen = Dimensions.get('window').width < 350;

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

        const translateY = this.state.fontSizeAnim.interpolate({
            inputRange: [0.85, 1],
            outputRange: [-10, 0]
        })

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
                            { translateY: translateY },
                            { scaleX: this.state.fontSizeAnim },
                            { scaleY: this.state.fontSizeAnim }]
                    }}>
                        <TextButton forwardedRef={ref => this.addButtonRef2 = ref} text={locale.add} height={50} fontSize={18} onPress={this.props.onAdd} />
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

                    const toValue = this.context.language === 'ru' ? px - px2 - 8 : px - px2;
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
        Animated.timing(this.state.expandAnim, { toValue: 50, duration: 150 }).start();
    }

    render() {
        const { locale, currency } = this.context;

        return <Animated.View style={{
            ...styles.incomeView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <View style={styles.wrapper}>
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
                    <IconButton size={40} innerSize={18} icon='close-circle' color='rgb(255, 69, 58)'
                        onPress={this.onRemove} />
                </Animated.View>
            </View>
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
        margin: 20,
        marginRight: 0,
        marginBottom: 40,
        flex: 1,
        justifyContent: 'center',
        position: 'relative'
    },
    addButton: {
        flexDirection: 'row',
        width: isSmallScreen ? '42%' : '36%',
        justifyContent: 'flex-end',
        paddingRight: 28,
    },
    incomeView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
    },
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%'
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15,
    },
    wrapper: {
        flexDirection: 'row',
        width: '100%'
    },
    incomeViewText: {
        alignSelf: 'center',
        fontSize: 18,
        width: '53%',
    },
    incomeViewAmount: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        paddingRight: 25,
        width: '35%'
    },
    incomeViewAmountText: {
        fontSize: 18,
    },
    removeButtonContainer: {
        alignSelf: 'center'
    },
});