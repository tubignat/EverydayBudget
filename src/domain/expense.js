import { computed, action, observable } from "mobx";
import { AsyncStorage } from 'react-native';

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
            const expensesString = await AsyncStorage.getItem(this.getStorageKey());
            if (expensesString !== null) {
                this.expenses = JSON.parse(expensesString);
                if (this.expenses.length > 0) {
                    this.expenseIdSeq = this.getHighestId(this.expenses) + 1;
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    getHighestId = (expensesArray) => expensesArray.map(e => e.id).reduce((acc, current) => acc > current ? acc : current);

    constructor() {
        this.init();
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

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    }

    @action
    removeExpense = (id) => {
        const index = this.expenses.findIndex(i => i.id === id);
        this.expenses.splice(index, 1);

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.expenses))
            .catch(error => console.error(error));
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

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    }

    getExpenses = (year, month) => this.expenses.filter(i => i.year === year && i.month === month);

    getStorageKey = () => 'expenses_storage';
}