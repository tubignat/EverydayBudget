import { IExpensesRepository, Expense, ExpenseId } from "./ExpensesRepository";
import { ISpendingsRepository, Spending, SpendingId } from "./SpendingsRepository";
import { IIncomesRepository, Income, IncomeId } from "./IncomesRepository";
import { BudgetService } from "./BudgetService";
import { observable, computed } from "../../node_modules/mobx/lib/mobx";
import { EnsureMonthIsSetUpService } from "./EnsureMonthIsSetUpService";

export class Application {
    private expensesRepository: IExpensesRepository;
    private spendingRepository: ISpendingsRepository;
    private incomesRepository: IIncomesRepository;

    private ensureMonthIsSetUpService: EnsureMonthIsSetUpService;
    private budgetService: BudgetService;

    constructor(
        incomesRepository: IIncomesRepository,
        expensesRepository: IExpensesRepository,
        spendingRepository: ISpendingsRepository,
        ensureMonthIsSetUpService: EnsureMonthIsSetUpService,
        budgetService: BudgetService
    ) {
        this.incomesRepository = incomesRepository;
        this.expensesRepository = expensesRepository;
        this.spendingRepository = spendingRepository;
        this.ensureMonthIsSetUpService = ensureMonthIsSetUpService;
        this.budgetService = budgetService;
    }

    @observable public incomes: Income[];
    @observable public expenses: Expense[];
    @observable public spendings: Spending[];
    @observable public budgetPerDay: number;
    @observable public saldos: number[];

    @observable public year: number;
    @observable public month: number;
    @observable public day: number;

    @computed public get todaysLimit() {
        return this.saldos[this.day - 1];
    }

    @computed public get todaysSpendings() {
        return this.spendings.filter(s => s.year === this.year && s.month === this.month && s.day === this.day);
    }

    @computed public get daysInMonth() {
        return new Date(this.year, this.month + 1, 0).getDate();
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

    public editIncome = (id: IncomeId, amount: number, description: string) => {
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

    public editExpense = (id: ExpenseId, amount: number, description: string) => {
        this.expensesRepository.edit(id, description, amount);
        this.init();
    }

    public removeExpense = (id: ExpenseId) => {
        this.expensesRepository.remove(id);
        this.init();
    }
}