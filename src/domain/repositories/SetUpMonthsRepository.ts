import { AsyncStorage } from 'react-native';

export type MonthSetUp = {
    year: number,
    month: number,
    startOfPeriod: number
}

export interface ISetUpMonthsRepository {
    markMonthAsSetUp: (year: number, month: number, startOfPeriod: number) => void;
    editMonthSetUp: (year: number, month: number, startOfPeriod: number) => void;
    getMonthSetUp: (year: number, month: number) => MonthSetUp | undefined;
    isMonthSetUp: (year: number, month: number) => boolean;
}

export class SetUpMonthsRepository implements ISetUpMonthsRepository {
    private setUpMonths: MonthSetUp[] = [];
    private storageKey = 'month_setup_storage';

    markMonthAsSetUp = (year: number, month: number, startOfPeriod: number) => {
        this.setUpMonths.push({ year: year, month: month, startOfPeriod: startOfPeriod });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.setUpMonths))
            .catch(error => console.error(error));
    };

    editMonthSetUp = (year: number, month: number, startOfPeriod: number) => {
        const i = this.setUpMonths.findIndex(s => s.year === year && s.month === month);
        this.setUpMonths[i].startOfPeriod = startOfPeriod;

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.setUpMonths))
            .catch(error => console.error(error));
    };

    getMonthSetUp = (year: number, month: number) => this.setUpMonths.find(s => s.year === year && s.month === month);

    isMonthSetUp = (year: number, month: number) => this.setUpMonths.some(s => s.year === year && s.month === month);

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.setUpMonths = result ? JSON.parse(result) : [];
        })
        .catch(error => console.log(error))
}
