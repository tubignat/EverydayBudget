import {AsyncStorage} from 'react-native';

export enum FeatureFlag { Statistics, TestFlag }

export type DevSettings = {
    devMenuVisible: boolean
    enabledFlags: FeatureFlag[]
}

export interface IDevSettingsRepository {
    get: () => DevSettings
    set: (value: DevSettings) => void
}

export class DevSettingsRepository implements IDevSettingsRepository {
    private devSettings: DevSettings = {
        devMenuVisible: false,
        enabledFlags: []
    }

    private storageKey = 'dev_settings_storage'

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => result && (this.devSettings = JSON.parse(result)))
        .catch(error => console.log(error));

    get = () => this.devSettings;

    set = (value: DevSettings) => {
        this.devSettings = value;
        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.devSettings))
            .catch(error => console.error(error));
    }
}
