import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { View, Text, TextInput, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from '../components/TextButton';

export class IncomesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(0),
            fontSizeAnim: new Animated.Value(1),
            fadeAnim: new Animated.Value(this.props.incomes.length === 0 ? 1 : 0)
        };
    }

    render() {
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
                        <TextButton forwardedRef={ref => this.addButonRef = ref} text='Добавить' height={50} fontSize={15} onPress={this.onAdd} />
                    </View>
                </Animated.View>
            }
            <View style={{ minHeight: 70 }}>
                {
                    this.props.incomes.map((i) =>
                        <IncomeView
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
                        transform: [{ translateX: this.state.moveAnim }, { scaleX: this.state.fontSizeAnim }, { scaleY: this.state.fontSizeAnim }]
                    }}>
                        <TextButton forwardedRef={ref => this.addButtonRef2 = ref} text='Добавить' height={50} fontSize={18} onPress={this.props.onAdd} />
                    </Animated.View>
                }
            </View>
        </View>
    }

    onAdd = () => {
        this.props.onAdd();
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
        });
    }

    onRemoveAnimationStart = () => {
        if (this.props.incomes.length === 1) {
            this.addButonRef.measure((fx, fy, width, height, px) => {
                Animated
                    .parallel([
                        Animated.timing(this.state.moveAnim, { toValue: px - 40 - 24, duration: 150 }),
                        Animated.timing(this.state.fontSizeAnim, { toValue: 0.85, duration: 150 }),
                    ])
                    .start();
                Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 600 }).start();
            })
        }
    }
}

class IncomeView extends Component {
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
        return <Animated.View style={{
            ...styles.incomeView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <View style={styles.wrapper}>
                <TouchableWithoutFeedback onPress={() => this.textInputRef.focus()}>
                    <View style={styles.incomeViewAmount}>
                        <TextInputWithTemporaryInvalidValue
                            forwardedRef={ref => this.textInputRef = ref}
                            style={styles.incomeViewAmountText}
                            value={this.props.income.amount.toString()}
                            onChange={(text) => this.props.onAmountChanged(Number(text))}
                            placeholder=''
                            isValidValue={(text) => {
                                const number = Number(text);
                                return !isNaN(number) && number !== 0;
                            }}
                        />
                        <Text style={styles.incomeViewAmountText}> &#8381;</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput
                    style={styles.incomeViewText}
                    onChangeText={this.props.onDescriptionChanged}
                    value={this.props.income.description}
                    selectTextOnFocus
                    placeholder='Описание...'
                />
            </View>
            <Animated.View style={{
                ...styles.removeButtonContainer,
                opacity: this.state.fadeAnim,
                transform: [{ scaleX: this.state.fadeAnim }, { scaleY: this.state.fadeAnim }]
            }}>
                <IconButton size={40} innerSize={18} icon='close-circle' color='rgb(255, 69, 58)'
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
        margin: 20,
        marginRight: 0,
        marginBottom: 40,
        flex: 1,
        justifyContent: 'center',
        position: 'relative'
    },
    addButton: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
    },
    emptyListTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%'
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeViewText: {
        alignSelf: 'center',
        flex: 1,
        flexGrow: 1.5,
        fontSize: 18,
    },
    incomeViewAmount: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%'
    },
    incomeViewAmountText: {
        fontSize: 18,
    },
    removeButtonContainer: {
        alignSelf: 'center'
    },
});