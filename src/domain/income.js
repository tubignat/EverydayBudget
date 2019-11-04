import { computed, action, observable } from "mobx";
class Income {
    id;
    amount;
    description;
    year;
    month;
}

export class IncomesStorage {
    @observable
    incomes = [];
    incomeIdSeq = 0;

    @action
    addIncome = (year, month, amount, description) => {
        this.incomeIdSeq++;

        const income = new Income();
        income.id = this.incomeIdSeq;
        income.amount = amount;
        income.description = description;
        income.year = year;
        income.month = month;

        this.incomes.push(income);
    }

    @action
    removeIncome = (id) => {
        const index = this.incomes.findIndex(i => i.id === id);
        this.incomes.splice(index, 1);
    }

    @action
    editIncome = (id, amount, description) => {
        const index = this.incomes.findIndex(i => i.id === id);
        const income = this.incomes[index];
        if (amount !== null) {
            income.amount = amount;
        }
        if (description !== null) {
            income.description = description;
        }
        this.incomes.splice(index, 1, income);
    }
    getIncomes = (year, month) => this.incomes.filter(i => i.year === year && i.month === month);
}