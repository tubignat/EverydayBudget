import { computed, action, observable } from "mobx";
import AsyncStorage from '@react-native-community/async-storage';

class Expense {
    id;
    amount;
    description;
    year;
    month;
}

export class ExpensesStorage {
    @observable
    expenses = [];
    expenseIdSeq = 0;

    init = async () => {
        try {
            await AsyncStorage.setItem('test_key', 'test_value');
            const result = await AsyncStorage.getItem('test_key');
            if (result !== null) {
                console.log(`Result is ${result}`);
            }

            const notExistingResult = await AsyncStorage.getItem('test_key_2');
            if (notExistingResult === null) {
                console.log(`Result is ${result}`);
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    constructor() {
        init();
    }

    @action
    addExpense = (year, month, amount, description) => {
        this.expenseIdSeq++;

        const expense = new Expense();
        expense.id = this.expenseIdSeq;
        expense.amount = amount;
        expense.description = description;
        expense.year = year;
        expense.month = month;

        this.expenses.push(expense);
    }

    @action
    removeExpense = (id) => {
        const index = this.expenses.findIndex(i => i.id === id);
        this.expenses.splice(index, 1);
    }

    @action
    editExpense = (id, amount, description) => {
        const index = this.expenses.findIndex(i => i.id === id);
        const expense = this.expenses[index];
        if (amount !== null) {
            expense.amount = amount;
        }
        if (description !== null) {
            expense.description = description;
        }
        this.expenses.splice(index, 1, expense);
    }
    getExpenses = (year, month) => this.expenses.filter(i => i.year === year && i.month === month);
}