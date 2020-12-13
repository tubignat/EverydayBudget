import { IExpensesRepository, Expense, ExpenseId } from "../domain/repositories/ExpensesRepository";
import { ISpendingsRepository } from "../domain/repositories/SpendingsRepository";
import { IIncomesRepository, Income, IncomeId } from "../domain/repositories/IncomesRepository";
import { BudgetService } from "../domain/services/BudgetService";
import { observable, computed } from "mobx";
import { EnsureMonthIsSetUpService } from "../domain/services/EnsureMonthIsSetUpService";
import { DefaultCategoriesService } from "../domain/services/DefaultCategoriesService";
import { Language, Currency, IUserPreferencesRepository, SortMode, ColorSchemePreference } from "../domain/repositories/UserPreferencesRepository";
import * as Localization from 'expo-localization';
import { enLocale } from "./locale/EnLocale";
import { ruLocale } from "./locale/RuLocale";
import { lightColorScheme } from "./color/LightColorScheme";
import { darkColorScheme } from "./color/DarkColorScheme";
import { Appearance } from 'react-native-appearance';
import { ISetUpMonthsRepository } from "../domain/repositories/SetUpMonthsRepository";
import { Spending, SpendingId } from "../domain/entities/Spending";
import { Category } from "../domain/entities/Category";
import { CategoryColor } from "../domain/entities/CategoryColor";
import { ICategoriesRepository } from "../domain/repositories/CategoriesRepository";
import { ICategoryColorsRepository } from "../domain/repositories/CategoryColorsRepository";

export class ApplicationState {
    private expensesRepository: IExpensesRepository;
    private spendingRepository: ISpendingsRepository;
    private incomesRepository: IIncomesRepository;
    private setUpMonthRepository: ISetUpMonthsRepository;
    private userPreferencesRepository: IUserPreferencesRepository;
    private categoriesRepository: ICategoriesRepository;
    private categoryColorsRepository: ICategoryColorsRepository;

    private ensureMonthIsSetUpService: EnsureMonthIsSetUpService;
    private budgetService: BudgetService;
    private defaultCategoriesService: DefaultCategoriesService;

    constructor(
        incomesRepository: IIncomesRepository,
        expensesRepository: IExpensesRepository,
        spendingRepository: ISpendingsRepository,
        setUpMonthRepository: ISetUpMonthsRepository,
        userPreferencesRepository: IUserPreferencesRepository,
        categoriesRepository: ICategoriesRepository,
        categoryColorsRepository: ICategoryColorsRepository,
        ensureMonthIsSetUpService: EnsureMonthIsSetUpService,
        budgetService: BudgetService,
        defaultCategoriesService: DefaultCategoriesService
    ) {
        this.incomesRepository = incomesRepository;
        this.expensesRepository = expensesRepository;
        this.spendingRepository = spendingRepository;
        this.setUpMonthRepository = setUpMonthRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.ensureMonthIsSetUpService = ensureMonthIsSetUpService;
        this.budgetService = budgetService;
        this.categoriesRepository = categoriesRepository;
        this.categoryColorsRepository = categoryColorsRepository;
        this.defaultCategoriesService = defaultCategoriesService;
    }

    @observable public language: Language = 'en';
    @observable public currency: Currency = '$';
    @observable public colorSchemePreference: ColorSchemePreference = 'auto';
    @observable public sortExpenses: SortMode = 'none';
    @observable public sortIncomes: SortMode = 'none';

    @observable public startOfPeriod: number = 1;

    @observable public incomes: Income[] = [];
    @observable public expenses: Expense[] = [];
    @observable public spendings: Spending[] = [];
    @observable public budgetPerDay: number = 0;
    @observable public saldos: number[] = [];
    @observable public categories: Category[] = [];
    @observable public categoryColors: CategoryColor[] = [];

    @observable public year: number = 0;
    @observable public month: number = 0;
    @observable public day: number = 0;

    @computed public get todaysLimit() {
        return this.saldos[this.day - 1];
    }

    @computed public get todaysSpendings() {
        return this.spendings.filter(s => s.year === this.year && s.month === this.month && s.day === this.day);
    }

    @computed public get daysInMonth() {
        return new Date(this.year, this.month + 1, 0).getDate();
    }

    @computed public get locale() {
        return this.language === 'ru' ? ruLocale : enLocale;
    }

    @computed public get colorScheme() {
        if (this.colorSchemePreference === 'light') {
            return lightColorScheme;
        }

        if (this.colorSchemePreference === 'dark') {
            return darkColorScheme;
        }

        if (Appearance.getColorScheme() === 'dark') {
            return darkColorScheme
        }

        return lightColorScheme;
    }

    @computed public get monthBudget() {
        return this.budgetPerDay * this.daysInMonth
    }

    @computed public get leftInMonth() {
        return this.monthBudget - this.spendings
            .filter(s => s.day >= this.startOfPeriod)
            .reduce((sum, spending) => sum + spending.amount, 0);
    }

    @computed public get todaysDelta() {
        return this.budgetPerDay - this.todaysSpendings.reduce((sum, spending) => sum + spending.amount, 0);
    }

    @computed public get savedThisMonth() {
        const fromPreviousDays = this.todaysLimit - this.todaysDelta
        return this.todaysDelta < 0 ? fromPreviousDays - Math.abs(this.todaysDelta) : fromPreviousDays
    }

    @computed public get sortedCategories() {
        const recentSpendings = this.spendingRepository.getAll().slice(0, 50);
        const categoriesByFrequency = [null, ...this.categories]
            .map(category => {
                return {
                    category: category,
                    occurences: category !== null
                        ? recentSpendings.filter(s => s.category?.id === category.id).length
                        : recentSpendings.filter(s => s.category === null).length
                }
            })
            .sort((a, b) => b.occurences - a.occurences)
            .map(c => c.category);

        return categoriesByFrequency;
    }

    public init = () => {
        const date = new Date();

        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();

        this.ensureMonthIsSetUpService.ensureMonthIsSetUp(this.year, this.month, this.day);

        this.startOfPeriod = this.setUpMonthRepository.getMonthSetUp(this.year, this.month)?.startOfPeriod ?? 1;

        this.incomes = this.incomesRepository.get(this.year, this.month);
        this.expenses = this.expensesRepository.get(this.year, this.month);
        this.spendings = this.spendingRepository.get(this.year, this.month);

        this.budgetPerDay = this.budgetService.getBudgetPerDay(this.year, this.month);

        this.saldos = this.budgetService.getSaldos(this.budgetPerDay, this.year, this.month, this.startOfPeriod);

        const preferences = this.userPreferencesRepository.get();

        this.language = preferences.language ?? this.getLanguageFromSystem();
        this.currency = preferences.currency ?? this.getCurrencyFromSystem();
        this.sortExpenses = preferences.sortExpenses ?? 'none';
        this.sortIncomes = preferences.sortIncomes ?? 'none';
        this.colorSchemePreference = preferences.colorSchemePreference ?? 'auto';

        this.defaultCategoriesService.ensureCategoriesAreSetUp(this.locale);

        this.categories = this.categoriesRepository.get();
        this.categoryColors = this.categoryColorsRepository.get();
    }

    public addSpending = (day: number, amount: number, hour: number | null, minute: number | null, category: Category | null) => {
        this.spendingRepository.add(this.year, this.month, day, null, amount, hour, minute, category);
        this.init();
    }

    public editSpending = (id: SpendingId, amount: number, category: Category | null) => {
        this.spendingRepository.edit(id, null, amount, category);
        this.init();
    }

    public removeSpending = (id: SpendingId) => {
        this.spendingRepository.remove(id);
        this.init();
    }

    public addIncome = (amount: number, description: string) => {
        this.incomesRepository.add(this.year, this.month, description, amount);
        this.init();
    }

    public editIncome = (id: IncomeId, amount: number | null, description: string | null) => {
        this.incomesRepository.edit(id, description, amount);
        this.init();
    }

    public removeIncome = (id: IncomeId) => {
        this.incomesRepository.remove(id);
        this.init();
    }

    public addExpense = (amount: number, description: string) => {
        this.expensesRepository.add(this.year, this.month, description, amount);
        this.init();
    }

    public editExpense = (id: ExpenseId, amount: number | null, description: string | null) => {
        this.expensesRepository.edit(id, description, amount);
        this.init();
    }

    public removeExpense = (id: ExpenseId) => {
        this.expensesRepository.remove(id);
        this.init();
    }

    public changeCurrency = (newCurrency: Currency) => {
        this.userPreferencesRepository.set({
            currency: newCurrency,
            language: this.language,
            sortExpenses: this.sortExpenses,
            sortIncomes: this.sortIncomes,
            colorSchemePreference: this.colorSchemePreference,
        });
        this.init();
    }

    public changeLanguage = (newLanguage: Language) => {
        this.userPreferencesRepository.set({
            language: newLanguage,
            currency: this.currency,
            sortExpenses: this.sortExpenses,
            sortIncomes: this.sortIncomes,
            colorSchemePreference: this.colorSchemePreference,
        });
        this.init();
    }

    public changeSortExpenses = (mode: SortMode) => {
        this.userPreferencesRepository.set({
            language: this.language,
            currency: this.currency,
            sortExpenses: mode,
            colorSchemePreference: this.colorSchemePreference,
            sortIncomes: this.sortIncomes
        });
        this.init();
    }

    public changeSortIncomes = (mode: SortMode) => {
        this.userPreferencesRepository.set({
            language: this.language,
            currency: this.currency,
            sortExpenses: this.sortExpenses,
            colorSchemePreference: this.colorSchemePreference,
            sortIncomes: mode
        });
        this.init();
    }

    public changeColorSchemePreference = (preference: ColorSchemePreference) => {
        this.userPreferencesRepository.set({
            language: this.language,
            currency: this.currency,
            sortExpenses: this.sortExpenses,
            colorSchemePreference: preference,
            sortIncomes: this.sortIncomes
        });
        this.init();
    }

    public changeStartOfPeriod = (startOfPeriod: number) => {
        this.setUpMonthRepository.editMonthSetUp(this.year, this.month, startOfPeriod);
        this.init();
    }

    public addCategory = (name: string, color: CategoryColor) => {
        this.categoriesRepository.add(name, color);
        this.init();
    }

    public removeCategory = (category: Category) => {
        this.categoriesRepository.remove(category.id);
        this.spendingRepository
            .getAll()
            .filter(spending => spending.category?.id === category.id)
            .forEach(spending => {
                this.spendingRepository.edit(spending.id, null, spending.amount, null);
            })

        this.init();
    }

    public editCategory = (category: Category, name: string, color: CategoryColor) => {
        this.categoriesRepository.edit(category.id, name, color);
        this.init();
    }

    private getLanguageFromSystem = (): Language => {
        const ruLocaleRegex = /^ru-\w\w$/
        return ruLocaleRegex.test(Localization.locale) ? 'ru' : 'en'
    }

    private getCurrencyFromSystem = (): Currency => {
        const ruLocaleRegex = /^\w\w-RU$/
        return ruLocaleRegex.test(Localization.locale) ? '₽' : '$'
    }
}
