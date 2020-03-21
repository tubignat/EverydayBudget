import { AsyncStorage } from 'react-native';

export type SpendingId = number;

export type Spending = {
    id: SpendingId;
    amount: number;
    description: string;
    year: number;
    month: number;
    day: number;
}

export interface ISpendingsRepository {
    add: (year: number, month: number, day: number, description: string, amount: number) => void;
    edit: (id: SpendingId, description: string, amount: number) => void;
    remove: (id: SpendingId) => void;
    get: (year: number, month: number) => Spending[];
    init: () => Promise<void>;
}

export class SpendingsRepository implements ISpendingsRepository {
    private storageKey = 'spendings_storage';
    private spendings: Spending[] = [];
    private spendingIdSeq: number = 0;

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.spendings = result ? JSON.parse(result) : [];
            this.spendingIdSeq = this.spendings.length === 0
                ? 0
                : this.spendings.map(e => e.id).reduce((max, current) => current > max ? current : max);
        })
        .catch(error => console.log(error));

    add = (year: number, month: number, day: number, description: string, amount: number) => {
        this.spendingIdSeq++;
        this.spendings.push({
            id: this.spendingIdSeq,
            amount: amount,
            description: description,
            year: year,
            month: month,
            day: day
        });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendings))
            .catch(error => console.error(error));
    };

    edit = (id: number, description: string, amount: number) => {
        const index = this.spendings.findIndex(i => i.id === id);
        this.spendings[index] = {
            ...this.spendings[index],
            amount: amount ? amount : this.spendings[index].amount,
            description: description ? description : this.spendings[index].description
        };

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendings))
            .catch(error => console.error(error));
    };

    remove = (id: number) => {
        const index = this.spendings.findIndex(i => i.id === id);
        this.spendings.splice(index, 1);

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendings))
            .catch(error => console.error(error));
    };

    get = (year: number, month: number) => this.spendings.filter(i => i.year === year && i.month === month);
}