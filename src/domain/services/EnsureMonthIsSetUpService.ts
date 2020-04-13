import { IIncomesRepository } from "../repositories/IncomesRepository";
import { IExpensesRepository } from "../repositories/ExpensesRepository";
import { ISetUpMonthsRepository } from "../repositories/SetUpMonthsRepository";

export class EnsureMonthIsSetUpService {
    private incomesRepository: IIncomesRepository
    private expensesRepository: IExpensesRepository;
    private setUpMonthsRepository: ISetUpMonthsRepository;

    constructor(incomesRepository: IIncomesRepository, expensesRepository: IExpensesRepository, setUpMonthsRepository: ISetUpMonthsRepository) {
        this.incomesRepository = incomesRepository;
        this.expensesRepository = expensesRepository;
        this.setUpMonthsRepository = setUpMonthsRepository;
    }

    ensureMonthIsSetUp = (year: number, month: number, day: number) => {
        const incomes = this.incomesRepository.get(year, month);
        const expenses = this.expensesRepository.get(year, month);

        const isMonthSetUp = this.setUpMonthsRepository.isMonthSetUp(year, month);

        if (incomes.length === 0 && expenses.length === 0 && !isMonthSetUp) {
            const { previousYear, previousMonth } = this.getPreviousMonth(year, month);

            const previousMonthIncomes = this.incomesRepository.get(previousYear, previousMonth);
            this.incomesRepository.addMany(year, month, previousMonthIncomes);

            const previousMonthExpenses = this.expensesRepository.get(previousYear, previousMonth);
            this.expensesRepository.addMany(year, month, previousMonthExpenses);

            const startOfPeriod = this.setUpMonthsRepository.isMonthSetUp(previousYear, previousMonth) ? 1 : day;

            this.setUpMonthsRepository.markMonthAsSetUp(year, month, startOfPeriod);
        }

        const monthSetUp = this.setUpMonthsRepository.getMonthSetUp(year, month);

        if (monthSetUp && monthSetUp.startOfPeriod > day) {
            this.setUpMonthsRepository.editMonthSetUp(year, month, day);
        }
    }

    private getPreviousMonth = (year: number, month: number) => {
        return {
            previousYear: month === 0 ? year - 1 : year,
            previousMonth: month === 0 ? 11 : month - 1
        }
    }
}