import {AsyncStorage} from "react-native";

export interface IRepository<T> {
    get: () => T;
    set: (value: T) => void;
}

export class Repository<T> implements IRepository<T> {
    constructor(private storageKey: string, private initializeFromDTO: (data: any) => T, private toDTO: (data: T) => any = (data) => data) { }

    private data?: T

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            const dto = result ? JSON.parse(result) : {}
            this.data = this.initializeFromDTO(dto)
        })
        .catch(error => console.log(error));

    get = () => {
        if (!this.data) {
            throw Error('Repository was not initialized!')
        }

        return this.data;
    }

    set = (value: T) => {
        this.data = value;
        const dto = this.toDTO(value)

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(dto))
            .catch(error => console.error(error));
    }
}

