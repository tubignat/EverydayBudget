import { computed, action, observable } from "mobx";
import { AsyncStorage } from 'react-native';

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

    init = async () => {
        try {
            const spendingsStorage = await AsyncStorage.getItem(this.getStorageKey());
            if (spendingsStorage !== null) {
                this.spendings = JSON.parse(spendingsStorage);
                this.spendings.forEach((s, i) => s.id = i);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    constructor() {
        this.init();
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

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.spendings))
            .catch(error => console.error(error));
    }

    removeSpending = (id) => {
        const index = this.spendings.findIndex(i => i.id === id);
        this.spendings.splice(index, 1);

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.spendings))
            .catch(error => console.error(error));
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


        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.spendings))
            .catch(error => console.error(error));
    }

    @computed
    get allSpendings() {
        return this.spendings
    };

    getSpendings = (year, month, day) => this.spendings.filter(i => i.year === year && i.month === month && i.day === day);

    getStorageKey = () => 'spendings_storage';
}