import { Category } from "../entities/Category";
import { AsyncStorage } from 'react-native';
import { CategoryColorId, CategoryColor } from "../entities/CategoryColor";
import { ICategoryColorsRepository } from "./CategoryColorsRepository";

export interface ICategoriesRepository {
    get: () => Category[]
    add: (name: string, color: CategoryColor) => void
    edit: (id: number, name: string, color: CategoryColor) => void
    remove: (id: number) => void
}

export class CategoriesRepository implements ICategoriesRepository {
    private readonly colorsRepository: ICategoryColorsRepository;
    private readonly storageKey: string;

    private categoryDTOs: CategoryDTO[];
    private idSeq: number;

    constructor(colorsRepository: ICategoryColorsRepository) {
        this.colorsRepository = colorsRepository;
        this.storageKey = 'categories_storage';

        this.categoryDTOs = [];
        this.idSeq = 0;
    }

    get = () => {
        const colors = this.colorsRepository.get();

        return this.categoryDTOs.map(dto => {
            return {
                id: dto.id,
                name: dto.name,
                color: colors.find(color => color.id === dto.colorId) ?? colors[0]
            }
        })
    }

    add = (name: string, color: CategoryColor) => {
        this.idSeq++;
        this.categoryDTOs.push({
            id: this.idSeq,
            name: name,
            colorId: color.id
        });

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.categoryDTOs))
            .catch(error => console.error(error));
    }

    edit = (id: number, name: string, color: CategoryColor) => {
        const index = this.categoryDTOs.findIndex(i => i.id === id);
        this.categoryDTOs[index] = {
            ...this.categoryDTOs[index],
            name: name,
            colorId: color.id
        };

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.categoryDTOs))
            .catch(error => console.error(error));
    }

    remove = (id: number) => {
        const index = this.categoryDTOs.findIndex(i => i.id === id);
        this.categoryDTOs.splice(index, 1);

        AsyncStorage
            .setItem(this.storageKey, JSON.stringify(this.categoryDTOs))
            .catch(error => console.error(error));
    }

    init = () => AsyncStorage
        .getItem(this.storageKey)
        .then(result => {
            this.categoryDTOs = result ? JSON.parse(result) : [];
            this.idSeq = this.categoryDTOs.length === 0
                ? 0
                : this.categoryDTOs.map(e => e.id).reduce((max, current) => current > max ? current : max);
        })
        .catch(error => console.log(error));
}

type CategoryDTO = {
    id: number
    name: string
    colorId: CategoryColorId
}
