import { IIncomesRepository } from "../domain/repositories/IncomesRepository";
import { IExpensesRepository } from "../domain/repositories/ExpensesRepository";
import { ISpendingsRepository } from "../domain/repositories/SpendingsRepository";
import { ICategoriesRepository } from "../domain/repositories/CategoriesRepository";
import { ICategoryColorsRepository } from "../domain/repositories/CategoryColorsRepository";

export class TestDataProvider {
    constructor(
        private incomesRepository: IIncomesRepository,
        private expensesRepository: IExpensesRepository,
        private spendingRepository: ISpendingsRepository,
        private categoriesRepository: ICategoriesRepository,
        private colorsRepository: ICategoryColorsRepository
    ) {
    }

    public fillTestDataEnglish(year: number, month: number, day: number) {
        this.incomesRepository.get(year, month).forEach(income => this.incomesRepository.remove(income.id));
        this.incomesRepository.addMany(year, month, [
            { description: 'Salary', amount: 4000 }
        ])

        this.expensesRepository.get(year, month).forEach(expense => this.expensesRepository.remove(expense.id));
        this.expensesRepository.addMany(year, month, [
            { description: 'Savings', amount: 1000 },
            { description: 'Mortgage', amount: 500 },
            { description: 'Car', amount: 250 },
            { description: 'Haircut', amount: 100 },
            { description: 'Gym', amount: 150 },
        ])

        this.categoriesRepository.get().forEach(c => this.categoriesRepository.remove(c.id));

        const colors = this.colorsRepository.get();
        this.categoriesRepository.add('Lunch', colors[0]);
        this.categoriesRepository.add('Groceries', colors[1]);
        this.categoriesRepository.add('Household', colors[2]);

        const categories = this.categoriesRepository.get();

        this.spendingRepository.get(year, month).forEach(spending => this.spendingRepository.remove(spending.id));
        this.spendingRepository.add(year, month, day, null, 25, 14, 20, categories[0]);
        this.spendingRepository.add(year, month, day, null, 16, 15, 30, categories[1]);
        this.spendingRepository.add(year, month, day, null, 8, 18, 59, null);

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i < daysInMonth - 1; i++) {
            const expense = Math.random() * 80;
            this.spendingRepository.add(year, month, i, null, expense, 14, 20, null);
        }
    }

    public fillTestDataRussian(year: number, month: number, day: number) {
        this.incomesRepository.get(year, month).forEach(income => this.incomesRepository.remove(income.id));
        this.incomesRepository.addMany(year, month, [
            { description: 'Зарплата', amount: 60000 }
        ])

        this.expensesRepository.get(year, month).forEach(expense => this.expensesRepository.remove(expense.id));
        this.expensesRepository.addMany(year, month, [
            { description: 'Откладываем', amount: 20000 },
            { description: 'Аренда', amount: 10000 },
            { description: 'Кредит', amount: 5000 },
            { description: 'Интернет', amount: 500 },
            { description: 'Спортзал', amount: 2500 },
        ])

        this.categoriesRepository.get().forEach(c => this.categoriesRepository.remove(c.id));

        const colors = this.colorsRepository.get();
        this.categoriesRepository.add('Обед', colors[0]);
        this.categoriesRepository.add('Продукты', colors[1]);
        this.categoriesRepository.add('Дом, ремонт', colors[2]);

        const categories = this.categoriesRepository.get();

        this.spendingRepository.get(year, month).forEach(spending => this.spendingRepository.remove(spending.id));
        this.spendingRepository.add(year, month, day, null, 250, 14, 20, categories[0]);
        this.spendingRepository.add(year, month, day, null, 110, 15, 30, categories[1]);
        this.spendingRepository.add(year, month, day, null, 300, 18, 59, null);

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i < daysInMonth - 1; i++) {
            const expense = Math.random() * 700;
            this.spendingRepository.add(year, month, i, null, expense, 14, 20, null);
        }
    }
}