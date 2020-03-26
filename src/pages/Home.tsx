import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { KeyBoard } from '../components/keyboard/Keyboard';
import { AddSpendingButton } from '../components/AddSpendingButton';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { ApplicationContext } from '../domain/ApplicationContext';
import { Application } from '../domain/Application';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface IHomeState {
    newTransactionRubles: number,
    newTransactionKopecks: number[],
    isKopeckMode: boolean
}

@observer
export default class Home extends Component<{}, IHomeState> {

    static contextType = ApplicationContext;

    constructor(props: {}) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: [],
            isKopeckMode: false
        };
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const { currency, locale, todaysLimit, todaysDelta }: Application = this.context;

        return <Page>
            {
                isBigScreen && <View style={styles.todaysBudgetContainer}>
                    <Text style={styles.header}>
                        {locale.homePageTitle}
                    </Text>
                </View>
            }
            <View style={styles.keyboardGroupContainer}>

                <View style={styles.budgetContainer}>
                    <Text style={styles.budgetText}>
                        {locale.todaysLimit}
                    </Text>
                    <Text style={{ ...styles.budget, color: todaysLimit < 0 ? 'rgb(255, 69, 58)' : 'black' }}>
                        {todaysLimit.toFixed(0)} {currency}
                    </Text>
                    <View style={styles.delta}>
                        <Text style={{ ...styles.deltaAmount, color: todaysDelta < 0 ? 'rgb(255, 69, 58)' : 'rgb(52, 199, 89)' }}>
                            {todaysDelta > 0 ? '+' : ''}{todaysDelta.toFixed(0)} {currency}
                        </Text>
                        <Text style={styles.deltaLabel}>  {locale.today} </Text>
                    </View>
                </View>

                <View style={styles.addTransactionContainer}>
                    <Text style={styles.addTransactionText}>{locale.addExpense}</Text>
                    <View style={styles.addTransactionInput}>
                        <Text style={styles.transaction}>
                            {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks.join('') : ''} {currency}
                        </Text>
                        <AddSpendingButton
                            onPress={this.onAddButtonPressed}
                            disabled={newTransactionRubles === 0 && newTransactionKopecks.length !== 2}
                        />
                    </View>
                </View>

                <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} />

            </View>
        </Page>
    }

    handleKeyPressed = (char: string) => {
        const { isKopeckMode, newTransactionRubles, newTransactionKopecks } = this.state;

        if (char === '.') {
            this.setState({ isKopeckMode: true })

        } else {
            const updatedRubles = isKopeckMode || newTransactionRubles > 9999
                ? newTransactionRubles
                : Number(newTransactionRubles.toString().concat(char));

            const updatedKopecks = !isKopeckMode || newTransactionKopecks.length === 2 || (newTransactionKopecks[0] === 0 && Number(char) === 0)
                ? newTransactionKopecks
                : newTransactionKopecks.concat(Number(char));

            this.setState({ newTransactionRubles: updatedRubles, newTransactionKopecks: updatedKopecks });
        }
    };

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    };

    onAddButtonPressed = () => {
        const kopecks = Number(this.state.newTransactionKopecks.join(''));
        const amount = this.state.newTransactionRubles + (kopecks / 100);

        this.context.addSpending(this.context.day, amount);

        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    }
}

const styles = StyleSheet.create({
    budgetText: {
        color: 'gray',
        marginBottom: 10,
    },
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40
    },
    budgetContainer: {
        marginLeft: 20,
        marginBottom: 40,
    },
    budget: {
        fontSize: isSmallScreen ? 40 : 50,
        marginLeft: 10,
        fontWeight: '200'
    },
    addTransactionContainer: {
        marginLeft: 30,
        marginBottom: isSmallScreen ? 10 : 20
    },
    addTransactionText: {
        color: 'gray',
        marginBottom: isSmallScreen ? 0 : 10
    },
    addTransactionInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 30,
        height: 60
    },
    addTransactionButton: {
        fontSize: 45,
    },
    transaction: {
        fontSize: isSmallScreen ? 30 : 40,
        fontWeight: '200'
    },
    keyboardGroupContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        marginBottom: 50,
        height: isSmallScreen ? 485 : 'auto',
        paddingRight: isSmallScreen ? 0 : 15,
        paddingLeft: isSmallScreen ? 0 : 15
    },
    todaysBudgetContainer: {
        paddingTop: isSmallScreen ? 30 : 45,
        padding: isSmallScreen ? 15 : 20,
        height: '100%',
    },
    delta: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
        marginTop: 5
    },
    deltaLabel: {
        color: 'gray',
        fontSize: 15,
    },
    deltaAmount: {
        fontSize: 18,
    }
});