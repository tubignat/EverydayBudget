import { AsyncStorage } from 'react-native';

export type Currency = '€' | '$' | '₽';
export type Language = 'en' | 'ru';

export type UserPreferences = {
    currency: Currency | null,
    language: Language | null
}

export interface IUserPreferencesRepository {
    get: () => UserPreferences;
    set: (value: UserPreferences) => void;
}

export class UserPreferencesRepository implements IUserPreferencesRepository {
    private userPreferences: UserPreferences = {
        currency: null,
        language: null
    };
    private storageKey = 'user_preferences_storage';

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => result && (this.userPreferences = JSON.parse(result)))
        .catch(error => console.log(error));

    get = () => this.userPreferences;

    set = (value: UserPreferences) => {
        this.userPreferences = value;
        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.userPreferences))
            .catch(error => console.error(error));
    }
}