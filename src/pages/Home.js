import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import { KeyBoard } from '../components/keyboard/Keyboard';
import { AddSpendingButton } from '../components/AddSpendingButton';
import { observer } from 'mobx-react';
import { getBudgetPerDay, getSaldo } from "../domain/budget";

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
        return getSaldo(budgetPerDay, spendingsStorage.getSpendings, year, month, day);
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const todaysBudget = this.getTodaysBudget(this.props.incomesStorage, this.props.expensesStorage, this.props.spendingsStorage).toFixed(0);

        return <ScrollView
            bounces={false}
            style={{ marginTop: 25, padding: 20 }}
        >
            <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>Бюджет на сегодня</Text>
                <Text style={[styles.budget, { color: todaysBudget < 0 ? 'rgb(255, 69, 58)' : 'black' }]}>{todaysBudget} &#8381;</Text>
            </View>
            <View style={styles.addTransactionContainer}>
                <Text style={styles.addTransactionText}>Добавить трату</Text>
                <View style={styles.addTransactionInput}>
                    <Text style={[styles.transaction, {}]}>
                        {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks.join('') : ''} &#8381;
                    </Text>
                    <AddSpendingButton onPress={this.onAddButtonPressed} disabled={newTransactionRubles === 0 && newTransactionKopecks.length !== 2} />
                </View>
            </View>
            <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} />
        </ScrollView>
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
        }
        else {
            const amount = newTransactionRubles <= 999 ? Number(newTransactionRubles.toString().concat(char)) : newTransactionRubles;
            this.setState({ newTransactionRubles: amount });
        }
    }

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    }

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
    budgetContainer: {
        marginLeft: 15,
        marginBottom: 30
    },
    budget: {
        fontSize: 60,
        marginLeft: 10,
        fontWeight: '200'
    },
    addTransactionContainer: {
        marginLeft: 20,
        marginBottom: 30
    },
    addTransactionText: {
        color: 'gray',
        marginBottom: 10
    },
    addTransactionInput: {
        flex: 1,
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
        fontSize: 40,
        fontWeight: '200'
    }
});