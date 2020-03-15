import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import { KeyBoard } from '../components/keyboard/Keyboard';
import { AddSpendingButton } from '../components/AddSpendingButton';
import { observer } from 'mobx-react';
import { getBudgetPerDay, getSaldo } from "../domain/budget";
import Page from '../components/Page'


const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

@observer
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: [],
            isKopeckMode: false
        };
    }

    getTodaysBudget(incomesStorage, expensesStorage, spendingsStorage) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const budgetPerDay = getBudgetPerDay(incomesStorage.getIncomes(year, month).map(i => i.amount), expensesStorage.getExpenses(year, month).map(e => e.amount), year, month);
        return getSaldo(budgetPerDay, spendingsStorage.allSpendings, year, month, day);
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const todaysBudget = this.getTodaysBudget(this.props.incomesStorage, this.props.expensesStorage, this.props.spendingsStorage).toFixed(0);

        return <Page>
            {
                isBigScreen && <View style={styles.todaysBudgetContainer}>
                    <Text style={styles.header}>Главная</Text>
                </View>
            }
            <View style={styles.keyboardGroupContainer}>
                <View style={styles.budgetContainer}>
                    <Text style={styles.budgetText}>Бюджет на сегодня</Text>
                    <Text
                        style={[styles.budget, { color: todaysBudget < 0 ? 'rgb(255, 69, 58)' : 'black' }]}>{todaysBudget} &#8381;</Text>
                </View>
                <View style={styles.addTransactionContainer}>
                    <Text style={styles.addTransactionText}>Добавить трату</Text>
                    <View style={styles.addTransactionInput}>
                        <Text style={[styles.transaction, {}]}>
                            {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks.join('') : ''} &#8381;
                        </Text>
                        <AddSpendingButton onPress={this.onAddButtonPressed}
                            disabled={newTransactionRubles === 0 && newTransactionKopecks.length !== 2} />
                    </View>
                </View>
                <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} />
            </View>
        </Page>
    }

    handleKeyPressed = (char) => {
        const { isKopeckMode, newTransactionRubles, newTransactionKopecks } = this.state;

        if (char === '.') {
            this.setState({ isKopeckMode: true })
        } else if (isKopeckMode) {
            if (newTransactionKopecks.length < 2) {
                const kopecks = newTransactionKopecks;
                if (kopecks.length === 1 && kopecks[0] === 0 && char === 0) {
                    return;
                }
                kopecks[kopecks.length] = char;
                this.setState({ newTransactionKopecks: kopecks });
            }
        } else {
            const amount = newTransactionRubles <= 9999 ? Number(newTransactionRubles.toString().concat(char)) : newTransactionRubles;
            this.setState({ newTransactionRubles: amount });
        }
    };

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    };

    onAddButtonPressed = () => {
        if (this.state.newTransactionRubles !== 0 || this.state.newTransactionKopecks.length === 2) {
            const date = new Date();
            const kopecks = Number(this.state.newTransactionKopecks.join(''));
            const amount = this.state.newTransactionRubles + (kopecks / 100);
            this.props.spendingsStorage.addSpending(date.getFullYear(), date.getMonth(), date.getDate(), amount)
            this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
        }
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
        marginBottom: 30,
    },
    budget: {
        fontSize: isSmallScreen ? 40 : 60,
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
    }
});