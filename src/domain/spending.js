import { computed, action, observable } from "mobx";
import { getBudgetPerDay, getSaldo } from "./budget";

class Spending {
    id;
    amount;
    description;
    year;
    month;
    day;
}

export class SpendingsStorage {
    @observable
    spendings = [{
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 2300
    },

    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 2450
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 100
    },

    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 345
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 123
    },

    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },

    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 500
    },
    {
        year: 2019,
        month: 5,
        day: 20,
        amount: 9999.99
    }
    ];

    constructor() {
        this.spendings.forEach((s, i) => s.id = i);
    }

    @action
    addSpending = (year, month, day, amount, description) => {

        const spending = new Spending();
        spending.id = this.spendings.length === 0 ? 0 : this.spendings[this.spendings.length - 1].id + 1;
        spending.amount = amount;
        spending.description = description;
        spending.year = year;
        spending.month = month;
        spending.day = day;

        this.spendings.push(spending);
    }

    removeSpending = (id) => {
        const index = this.spendings.findIndex(i => i.id === id);
        this.spendings.splice(index, 1);
    }

    @computed
    get allSpendings() {
        return this.spendings
    };

    getSpendings = (year, month, day) => this.spendings.filter(i => i.year === year && i.month === month && i.day === day);

    @computed
    get todaysBudget() {
        const date = new Date();
        const budgetPerDay = getBudgetPerDay([80000], [10000], date.getFullYear(), date.getMonth());
        return getSaldo(budgetPerDay, this.getSpendings.bind(this), date.getFullYear(), date.getMonth(), date.getDate());
    }
}