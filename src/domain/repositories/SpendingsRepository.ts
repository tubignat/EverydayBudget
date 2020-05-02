import { AsyncStorage } from 'react-native';
import { SpendingId, Spending } from '../entities/Spending';
import { Category } from '../entities/Category';
import { ICategoriesRepository } from './CategoriesRepository';

export interface ISpendingsRepository {
    add: (
        year: number,
        month: number,
        day: number,
        description: string | null,
        amount: number,
        hour: number | null,
        minute: number | null,
        category: Category | null
    ) => void;
    edit: (id: SpendingId, description: string | null, amount: number, category: Category | null) => void;
    remove: (id: SpendingId) => void;
    get: (year: number, month: number) => Spending[];
    getAll: () => Spending[];
}

export class SpendingsRepository implements ISpendingsRepository {
    private readonly categoriesRepository: ICategoriesRepository;
    private storageKey = 'spendings_storage';
    private spendingDTOs: SpendingDTO[] = [];
    private spendingIdSeq: number = 0;

    constructor(categoriesRepository: ICategoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.spendingDTOs = result ? JSON.parse(result) : [];
            this.spendingIdSeq = this.spendingDTOs.length === 0
                ? 0
                : this.spendingDTOs.map(e => e.id).reduce((max, current) => current > max ? current : max);
        })
        .catch(error => console.log(error));

    add = (
        year: number,
        month: number,
        day: number,
        description: string | null,
        amount: number,
        hour: number | null,
        minute: number | null,
        category: Category | null
    ) => {
        this.spendingIdSeq++;
        this.spendingDTOs.push({
            id: this.spendingIdSeq,
            amount: amount,
            description: description,
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            categoryId: category ? category.id : null
        });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendingDTOs))
            .catch(error => console.error(error));
    };

    edit = (id: number, description: string | null, amount: number, category: Category | null) => {
        const index = this.spendingDTOs.findIndex(i => i.id === id);
        this.spendingDTOs[index] = {
            ...this.spendingDTOs[index],
            amount: amount ? amount : this.spendingDTOs[index].amount,
            description: description ? description : this.spendingDTOs[index].description,
            categoryId: category ? category.id : null
        };

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendingDTOs))
            .catch(error => console.error(error));
    };

    remove = (id: number) => {
        const index = this.spendingDTOs.findIndex(i => i.id === id);
        this.spendingDTOs.splice(index, 1);

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.spendingDTOs))
            .catch(error => console.error(error));
    };

    get = (year: number, month: number) => {
        const categories = this.categoriesRepository.get();

        return this.spendingDTOs
            .filter(i => i.year === year && i.month === month)
            .map(dto => {
                return {
                    id: dto.id,
                    amount: dto.amount,
                    description: dto.description,
                    year: dto.year,
                    month: dto.month,
                    day: dto.day,
                    hour: dto.hour,
                    minute: dto.minute,
                    category: categories.find(category => category.id === dto.categoryId) ?? null
                }
            })
    };

    getAll = () => {
        const categories = this.categoriesRepository.get();

        return this.spendingDTOs.map(dto => {
            return {
                id: dto.id,
                amount: dto.amount,
                description: dto.description,
                year: dto.year,
                month: dto.month,
                day: dto.day,
                hour: dto.hour,
                minute: dto.minute,
                category: categories.find(category => category.id === dto.categoryId) ?? null
            }
        })
    }
}

type SpendingDTO = {
    id: SpendingId;
    amount: number;
    description: string | null;
    year: number;
    month: number;
    day: number;
    hour: number | null;
    minute: number | null;
    categoryId: number | null;
}