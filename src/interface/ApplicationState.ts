import {Expense, ExpenseId, IExpensesRepository} from "../domain/repositories/ExpensesRepository";
import {ISpendingsRepository} from "../domain/repositories/SpendingsRepository";
import {IIncomesRepository, Income, IncomeId} from "../domain/repositories/IncomesRepository";
import {BudgetService} from "../domain/services/BudgetService";
import {computed, observable} from "mobx";
import {EnsureMonthIsSetUpService} from "../domain/services/EnsureMonthIsSetUpService";
import {DefaultCategoriesService} from "../domain/services/DefaultCategoriesService";
import {ColorSchemePreference, Currency, IUserPreferencesRepository, Language, SortMode} from "../domain/repositories/UserPreferencesRepository";
import * as Localization from 'expo-localization';
import {enLocale} from "./locale/EnLocale";
import {ruLocale} from "./locale/RuLocale";
import {lightColorScheme} from "./color/LightColorScheme";
import {darkColorScheme} from "./color/DarkColorScheme";
import {Appearance} from 'react-native-appearance';
import {ISetUpMonthsRepository} from "../domain/repositories/SetUpMonthsRepository";
import {Spending, SpendingId} from "../domain/entities/Spending";
import {Category} from "../domain/entities/Category";
import {CategoryColor} from "../domain/entities/CategoryColor";
import {ICategoriesRepository} from "../domain/repositories/CategoriesRepository";
import {ICategoryColorsRepository} from "../domain/repositories/CategoryColorsRepository";
import {DistributionByDaysOfWeek} from "./StatisticsState";

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

    @observable public monthIncomes: Income[] = [];
    @observable public monthExpenses: Expense[] = [];
    @observable public monthSpendings: Spending[] = [];
    @observable public allIncomes: Income[] = [];
    @observable public allExpenses: Expense[] = [];
    @observable public allSpendings: Spending[] = [];
    @observable public budgetPerDay: number = 0;
    @observable public saldos: number[] = [];
    @observable public categories: Category[] = [];
    @observable public categoryColors: CategoryColor[] = [];

    @observable public year: number = 0;
    @observable public month: number = 0;
    @observable public day: number = 0;

    @computed
    public get todaysLimit() {
        return this.saldos[this.day - 1];
    }

    @computed
    public get todaysSpendings() {
        return this.monthSpendings.filter(s => s.year === this.year && s.month === this.month && s.day === this.day);
    }

    @computed
    public get daysInMonth() {
        return new Date(this.year, this.month + 1, 0).getDate();
    }

    @computed
    public get locale() {
        return this.language === 'ru' ? ruLocale : enLocale;
    }

    @computed
    public get isDarkTheme() {
        return this.colorSchemePreference === 'dark' || (this.colorSchemePreference === 'auto' && Appearance.getColorScheme() === 'dark')
    }


    @computed
    public get colorScheme() {
        return this.isDarkTheme ? darkColorScheme : lightColorScheme
    }

    @computed
    public get incomesSum() {
        return this.monthIncomes.reduce((sum, income) => sum + income.amount, 0)
    }

    @computed
    public get expensesSum() {
        return this.monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    }

    @computed
    public get monthBudget() {
        return this.budgetPerDay * this.daysInMonth
    }

    @computed
    public get leftInMonth() {
        return this.monthBudget - this.monthSpendings
            .filter(s => s.day >= this.startOfPeriod)
            .reduce((sum, spending) => sum + spending.amount, 0);
    }

    @computed
    public get todaysDelta() {
        return this.budgetPerDay - this.todaysSpendings.reduce((sum, spending) => sum + spending.amount, 0);
    }

    @computed
    public get savedThisMonth() {
        const fromPreviousDays = this.todaysLimit - this.todaysDelta
        return this.todaysDelta < 0 ? fromPreviousDays - Math.abs(this.todaysDelta) : fromPreviousDays
    }

    @computed
    public get sortedCategories() {
        const recentSpendings = this.spendingRepository.getAll().slice(0, 50);
        return [null, ...this.categories]
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
    }

    @computed
    public get distributionByDaysOfWeek() {
        return this.calcDistributionByDaysOfWeek(this.allSpendings)
    }

    @computed
    public get distributionByDaysOfWeekForMonth() {
        return this.calcDistributionByDaysOfWeek(this.monthSpendings)
    }

    @computed
    public get distributionByCategory() {
        return this.calcDistributionByCategory(this.allSpendings)
    }

    @computed
    public get distributionByCategoryForMonth() {
        return this.calcDistributionByCategory(this.monthSpendings)
    }

    private calcDistributionByDaysOfWeek(spendings: Spending[]) {
        return spendings
            .map(spending => {
                return {
                    amount: spending.amount,
                    dayOfWeek: new Date(spending.year, spending.month, spending.day).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
                }
            })
            .reduce((byDayOfWeek, current) => {
                byDayOfWeek[current.dayOfWeek] += current.amount
                return byDayOfWeek
            }, [0, 0, 0, 0, 0, 0, 0])
    }

    private calcDistributionByCategory(spendings: Spending[]) {
        const byCategoryId = spendings.reduce((byCategory, current) => {
            const id = current.category?.id ?? -1
            byCategory[id] = byCategory[id] ? byCategory[id] + current.amount : current.amount
            return byCategory
        }, {} as { [key: number]: number })

        return Object.keys(byCategoryId).map(key => {
            const categoryId = Number(key)
            return {
                category: this.categories.find(category => category.id === categoryId),
                amount: byCategoryId[categoryId]
            }
        })
    }

    @computed
    public get daysWithPositiveLimitToDaysWithNegativeLimitRatioForMonth() {
        let daysWithPositiveBudget = 0

        for (let i = 1; i <= this.daysInMonth; i++) {
            const spendingsAmount = this.monthSpendings.filter(s => s.day === i).reduce((sum, s) => sum + s.amount, 0)
            if (spendingsAmount <= this.budgetPerDay) {
                daysWithPositiveBudget++
            }
        }

        return daysWithPositiveBudget / this.daysInMonth
    }

    @computed
    public get theBiggestSpending() {
        return this.allSpendings.length > 0
            ? this.allSpendings.reduce((max, cur) => cur.amount > max.amount ? cur : max)
            : null
    }

    @computed
    public get theBiggestSpendingForMonth() {
        return this.monthSpendings.length > 0
            ? this.monthSpendings.reduce((max, cur) => cur.amount > max.amount ? cur : max)
            : null
    }

    @computed
    public get theSmallestSpending() {
        return this.allSpendings.length > 0
            ? this.allSpendings.reduce((min, cur) => cur.amount < min.amount ? cur : min)
            : null
    }

    @computed
    public get theSmallestSpendingForMonth() {
        return this.monthSpendings.length > 0
            ? this.monthSpendings.reduce((min, cur) => cur.amount < min.amount ? cur : min)
            : null
    }

    @computed
    public get averageSpending() {
        return this.allSpendings.length > 0
            ? this.allSpendings.reduce((sum, cur) => sum + cur.amount, 0) / this.allSpendings.length
            : 0
    }

    @computed
    public get averageSpendingForMonth() {
        return this.monthSpendings.length > 0
            ? this.monthSpendings.reduce((sum, cur) => sum + cur.amount, 0) / this.monthSpendings.length
            : 0
    }

    public init = () => {
        const date = new Date();

        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.day = date.getDate();

        this.ensureMonthIsSetUpService.ensureMonthIsSetUp(this.year, this.month, this.day);

        this.startOfPeriod = this.setUpMonthRepository.getMonthSetUp(this.year, this.month)?.startOfPeriod ?? 1;

        this.monthIncomes = this.incomesRepository.get(this.year, this.month);
        this.monthExpenses = this.expensesRepository.get(this.year, this.month);
        this.monthSpendings = this.spendingRepository.get(this.year, this.month);

        this.allSpendings = this.spendingRepository.getAll()

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
