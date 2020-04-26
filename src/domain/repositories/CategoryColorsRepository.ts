import { CategoryColor } from "../entities/CategoryColor";

export interface ICategoryColorsRepository {
    get: () => CategoryColor[]
}

export class CategoryColorsRepository implements ICategoryColorsRepository {
    public get() {
        return [
            { id: 0, color: '#007AFF' },
            { id: 1, color: '#34C759' },
            { id: 2, color: '#D656D1' },
            { id: 3, color: '#FF9500' },
            { id: 4, color: '#DE3B30' },
            { id: 5, color: '#590000' },
            { id: 6, color: '#F6DE00' },
            { id: 7, color: '#2BBCD0' },
            { id: 8, color: '#FFC9C9' },
            { id: 9, color: '#3F3E86' },
        ]
    }
}