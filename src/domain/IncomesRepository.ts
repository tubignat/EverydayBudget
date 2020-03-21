import { AsyncStorage } from 'react-native';

export type IncomeId = number;

export type Income = {
    id: IncomeId;
    amount: number;
    description: string;
    year: number;
    month: number;
}

export interface IIncomesRepository {
    add: (year: number, month: number, description: string, amount: number) => void;
    addMany: (year: number, month: number, incomes: { description: string, amount: number }[]) => void;
    edit: (id: IncomeId, description: string, amount: number) => void;
    remove: (id: IncomeId) => void;
    get: (year: number, month: number) => Income[];
    init: () => Promise<void>;
}

export class IncomesRepository implements IIncomesRepository {
    private storageKey = 'incomes_storage';
    private incomes: Income[] = [];
    private incomeIdSeq: number = 0;

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.incomes = result ? JSON.parse(result) : [];
            this.incomeIdSeq = this.incomes.length === 0
                ? 0
                : this.incomes.map(e => e.id).reduce((max, current) => current > max ? current : max);
        })
        .catch(error => console.log(error));


    add = (year: number, month: number, description: string, amount: number) => {
        this.incomeIdSeq++;
        this.incomes.push({
            id: this.incomeIdSeq,
            amount: amount,
            description: description,
            year: year,
            month: month
        });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    };

    addMany = (year: number, month: number, incomes: { description: string, amount: number }[]) => {
        for (const income of incomes) {
            this.incomeIdSeq++;
            this.incomes.push({
                id: this.incomeIdSeq,
                amount: income.amount,
                description: income.description,
                year: year,
                month: month
            });
        }

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    }

    edit = (id: number, description: string, amount: number) => {
        const index = this.incomes.findIndex(i => i.id === id);
        this.incomes[index] = {
            ...this.incomes[index],
            amount: amount ? amount : this.incomes[index].amount,
            description: description ? description : this.incomes[index].description
        };

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    };

    remove = (id: number) => {
        const index = this.incomes.findIndex(i => i.id === id);
        this.incomes.splice(index, 1);

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.incomes))
            .catch(error => console.error(error));
    };

    get = (year: number, month: number) => this.incomes.filter(i => i.year === year && i.month === month);
}