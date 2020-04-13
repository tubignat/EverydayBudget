import { IExpensesRepository } from "../repositories/ExpensesRepository";
import { ISpendingsRepository } from "../repositories/SpendingsRepository";
import { IIncomesRepository } from "../repositories/IncomesRepository";

export class BudgetService {
    private expensesRepository: IExpensesRepository;
    private spendingRepository: ISpendingsRepository;
    private incomesRepository: IIncomesRepository;

    constructor(incomesRepository: IIncomesRepository, expensesRepository: IExpensesRepository, spendingRepository: ISpendingsRepository) {
        this.incomesRepository = incomesRepository;
        this.expensesRepository = expensesRepository;
        this.spendingRepository = spendingRepository;
    }

    getBudgetPerDay = (year: number, month: number) => {
        const daysInMonth = this.daysInMonth(year, month);

        const totalIncome = this.incomesRepository.get(year, month).reduce((sum, income) => sum + income.amount, 0);
        const totalExpense = this.expensesRepository.get(year, month).reduce((sum, expense) => sum + expense.amount, 0);

        return (totalIncome - totalExpense) / daysInMonth;
    }

    getSaldos = (budgetPerDay: number, year: number, month: number, startOfPeriod: number) => {
        const daysInMonth = this.daysInMonth(year, month);
        const spendings = this.spendingRepository.get(year, month);
        const monthSpendings = spendings.filter(s => s.year === year && s.month === month && s.day >= startOfPeriod).sort((a, b) => a.day - b.day);

        let saldos = [];

        let dayIterator = startOfPeriod - 1;
        let spendingsIterator = 0;

        saldos[dayIterator] = budgetPerDay;

        while (dayIterator !== daysInMonth - 1 || spendingsIterator <= monthSpendings.length - 1) {
            if (spendingsIterator > monthSpendings.length - 1) {
                dayIterator++;
                saldos[dayIterator] = saldos[dayIterator - 1] + budgetPerDay;
                continue;
            }

            if (dayIterator + 1 !== monthSpendings[spendingsIterator].day) {
                dayIterator++;
                saldos[dayIterator] = saldos[dayIterator - 1] + budgetPerDay;
                continue;
            }

            saldos[dayIterator] -= monthSpendings[spendingsIterator].amount;

            spendingsIterator++;
        }

        return saldos;
    }

    private daysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }
}