import { IExpensesRepository, Expense, ExpenseId } from "../domain/repositories/ExpensesRepository";
import { ISpendingsRepository, Spending, SpendingId } from "../domain/repositories/SpendingsRepository";
import { IIncomesRepository, Income, IncomeId } from "../domain/repositories/IncomesRepository";
import { BudgetService } from "../domain/services/BudgetService";
import { observable, computed } from "mobx";
import { EnsureMonthIsSetUpService } from "../domain/services/EnsureMonthIsSetUpService";
import { Language, Currency, IUserPreferencesRepository, SortMode } from "../domain/repositories/UserPreferencesRepository";
import * as Localization from 'expo-localization';
import { enLocale } from "./locale/EnLocale";
import { ruLocale } from "./locale/RuLocale";

export class ApplicationState {
    private expensesRepository: IExpensesRepository;
    private spendingRepository: ISpendingsRepository;
    private incomesRepository: IIncomesRepository;
    private userPreferencesRepository: IUserPreferencesRepository;

    private ensureMonthIsSetUpService: EnsureMonthIsSetUpService;
    private budgetService: BudgetService;

    constructor(
        incomesRepository: IIncomesRepository,
        expensesRepository: IExpensesRepository,
        spendingRepository: ISpendingsRepository,
        userPreferencesRepository: IUserPreferencesRepository,
        ensureMonthIsSetUpService: EnsureMonthIsSetUpService,
        budgetService: BudgetService
    ) {
        this.incomesRepository = incomesRepository;
        this.expensesRepository = expensesRepository;
        this.spendingRepository = spendingRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.ensureMonthIsSetUpService = ensureMonthIsSetUpService;
        this.budgetService = budgetService;
    }

    @observable public language: Language = 'en';
    @observable public currency: Currency = '$';
    @observable public sortExpenses: SortMode = 'none';
    @observable public sortIncomes: SortMode = 'none';

    @observable public incomes: Income[] = [];
    @observable public expenses: Expense[] = [];
    @observable public spendings: Spending[] = [];
    @observable public budgetPerDay: number = 0;
    @observable public saldos: number[] = [];

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

    @computed public get todaysDelta() {
        return this.budgetPerDay - this.todaysSpendings.map(s => s.amount).reduce((sum, spending) => sum + spending, 0);
    }

    public init = () => {
        const date = new Date();

        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();

        this.ensureMonthIsSetUpService.ensureMonthIsSetUp(this.year, this.month);

        this.incomes = this.incomesRepository.get(this.year, this.month);
        this.expenses = this.expensesRepository.get(this.year, this.month);
        this.spendings = this.spendingRepository.get(this.year, this.month);

        this.budgetPerDay = this.budgetService.getBudgetPerDay(this.year, this.month);

        this.saldos = this.budgetService.getSaldos(this.budgetPerDay, this.year, this.month);

        const preferences = this.userPreferencesRepository.get();
        this.language = preferences.language ?? this.getLanguageFromSystem();
        this.currency = preferences.currency ?? this.getCurrencyFromSystem();
        this.sortExpenses = preferences.sortExpenses ?? 'none';
        this.sortIncomes = preferences.sortIncomes ?? 'none';
    }

    public addSpending = (day: number, amount: number) => {
        this.spendingRepository.add(this.year, this.month, day, null, amount);
        this.init();
    }

    public editSpending = (id: SpendingId, amount: number) => {
        this.spendingRepository.edit(id, null, amount);
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
            sortIncomes: this.sortIncomes
        });
        this.init();
    }

    public changeLanguage = (newLanguage: Language) => {
        this.userPreferencesRepository.set({
            language: newLanguage,
            currency: this.currency,
            sortExpenses: this.sortExpenses,
            sortIncomes: this.sortIncomes
        });
        this.init();
    }

    public changeSortExpenses = (mode: SortMode) => {
        this.userPreferencesRepository.set({
            language: this.language,
            currency: this.currency,
            sortExpenses: mode,
            sortIncomes: this.sortIncomes
        });
        this.init();
    }

    public changeSortIncomes = (mode: SortMode) => {
        this.userPreferencesRepository.set({
            language: this.language,
            currency: this.currency,
            sortExpenses: this.sortExpenses,
            sortIncomes: mode
        });
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