import { computed, action, observable } from "mobx";

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
    spendings = [];

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

    editSpending = (id, amount, description) => {
        const index = this.spendings.findIndex(i => i.id === id);
        this.spendings[index] = {
            id: id,
            amount: amount,
            description: description,
            year: this.spendings[index].year,
            month: this.spendings[index].month,
            day: this.spendings[index].day
        };
    }

    @computed
    get allSpendings() {
        return this.spendings
    };

    getSpendings = (year, month, day) => this.spendings.filter(i => i.year === year && i.month === month && i.day === day);
}