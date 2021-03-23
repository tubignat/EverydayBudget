import {AsyncStorage} from 'react-native';

export type FirstTimeInit = {
    areCategoriesSetUp: boolean
}

export interface IFirstTimeInitRepository {
    get: () => FirstTimeInit;
    set: (value: FirstTimeInit) => void;
}

export class FirstTimeInitRepository implements IFirstTimeInitRepository {
    private firstTimeInit: FirstTimeInit = {
        areCategoriesSetUp: false
    };

    private storageKey = 'first_time_init_storage';

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => result && (this.firstTimeInit = JSON.parse(result)))
        .catch(error => console.log(error));

    get = () => this.firstTimeInit;

    set = (value: FirstTimeInit) => {
        this.firstTimeInit = value;
        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.firstTimeInit))
            .catch(error => console.error(error));
    }
}
