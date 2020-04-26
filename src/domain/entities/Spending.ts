import { Category } from "./Category";

export type SpendingId = number;

export type Spending = {
    id: SpendingId;
    amount: number;
    description: string | null;
    year: number;
    month: number;
    day: number;
    hour: number | null;
    minute: number | null;
    category: Category | null;
}