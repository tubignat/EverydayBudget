import { AsyncStorage } from 'react-native';

export type ExpenseId = number;

export type Expense = {
    id: ExpenseId;
    amount: number;
    description: string;
    year: number;
    month: number;
}

export interface IExpensesRepository {
    add: (year: number, month: number, description: string, amount: number) => void;
    addMany: (year: number, month: number, incomes: { description: string, amount: number }[]) => void;
    edit: (id: ExpenseId, description: string | null, amount: number | null) => void;
    remove: (id: ExpenseId) => void;
    get: (year: number, month: number) => Expense[];
}

export class ExpensesRepository implements IExpensesRepository {
    private storageKey = 'expenses_storage';
    private expenses: Expense[] = [];
    private expenseIdSeq: number = 0;

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.expenses = result ? JSON.parse(result) : [];
            this.expenseIdSeq = this.expenses.length === 0
                ? 0
                : this.expenses.map(e => e.id).reduce((max, current) => current > max ? current : max);
        })
        .catch(error => console.log(error));

    add = (year: number, month: number, description: string, amount: number) => {
        this.expenseIdSeq++;
        this.expenses.push({
            id: this.expenseIdSeq,
            amount: amount,
            description: description,
            year: year,
            month: month
        });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    };


    addMany = (year: number, month: number, expenses: { description: string, amount: number }[]) => {
        for (const expense of expenses) {
            this.expenseIdSeq++;
            this.expenses.push({
                id: this.expenseIdSeq,
                amount: expense.amount,
                description: expense.description,
                year: year,
                month: month
            });
        }

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    }

    edit = (id: number, description: string | null, amount: number | null) => {
        const index = this.expenses.findIndex(i => i.id === id);
        this.expenses[index] = {
            ...this.expenses[index],
            amount: amount ? amount : this.expenses[index].amount,
            description: description !== null ? description : this.expenses[index].description
        };

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    };

    remove = (id: number) => {
        const index = this.expenses.findIndex(i => i.id === id);
        this.expenses.splice(index, 1);

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.expenses))
            .catch(error => console.error(error));
    };

    get = (year: number, month: number) => this.expenses.filter(i => i.year === year && i.month === month);
}