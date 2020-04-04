import { AsyncStorage } from 'react-native';

type MonthSetUp = {
    year: number,
    month: number
}

export interface ISetUpMonthsRepository {
    markMonthAsSetUp: (year: number, month: number) => void;
    isMonthSetUp: (year: number, month: number) => boolean;
}

export class SetUpMonthsRepository implements ISetUpMonthsRepository {
    private setUpMonths: MonthSetUp[] = [];
    private storageKey = 'month_setup_storage';

    markMonthAsSetUp = (year: number, month: number) => {
        this.setUpMonths.push({ year: year, month: month });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.setUpMonths))
            .catch(error => console.error(error));
    };

    isMonthSetUp = (year: number, month: number) => this.setUpMonths.some(s => s.year === year && s.month === month);

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.setUpMonths = result ? JSON.parse(result) : [];
        })
        .catch(error => console.log(error))
}
