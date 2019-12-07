import { computed, action, observable } from "mobx";
import { AsyncStorage } from 'react-native';

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

    init = async () => {
        try {
            const incomesString = await AsyncStorage.getItem(this.getStorageKey());
            if (incomesString !== null) {
                this.incomes = JSON.parse(incomesString);
                this.incomeIdSeq = this.getHighestId(this.incomes) + 1;
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    constructor() {
        this.init();
    }

    getHighestId = (incomesArray) => incomesArray.map(i => i.id).reduce((acc, current) => acc > current ? acc : current);

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

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    }

    @action
    removeIncome = (id) => {
        const index = this.incomes.findIndex(i => i.id === id);
        this.incomes.splice(index, 1);

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.incomes))
            .catch(error => console.error(error));
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

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    }

    getIncomes = (year, month) => this.incomes.filter(i => i.year === year && i.month === month);

    getStorageKey = () => 'incomes_storage';
}