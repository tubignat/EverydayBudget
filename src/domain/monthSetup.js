import { observable } from "../../node_modules/mobx/lib/mobx";
import { AsyncStorage } from 'react-native';

export class MonthSetupStorage {
    @observable
    monthSetups = []

    @observable
    isInitiated = false

    init = async () => {
        try {
            const monthSetupsStorage = await AsyncStorage.getItem(this.getStorageKey());
            if (monthSetupsStorage !== null) {
                this.monthSetups = JSON.parse(monthSetupsStorage);
            }

            this.isInitiated = true;
        }
        catch (e) {
            console.error(e);
        }
    }

    constructor() {
        this.init();
    }

    isMonthSetUp = (year, month) => this.monthSetups.some(setup => setup.year === year && setup.month === month);

    addMonthSetup = (year, month) => {
        this.monthSetups.push({
            year: year,
            month: month
        });

        AsyncStorage
            .setItem(this.getStorageKey(), JSON.stringify(this.monthSetups))
            .catch(error => console.error(error));
    }

    getStorageKey = () => 'month_setup_storage';
}