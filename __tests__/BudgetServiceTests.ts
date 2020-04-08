import { BudgetService } from "../src/domain/services/BudgetService"
import { IIncomesRepository } from "../src/domain/repositories/IncomesRepository";
import { IExpensesRepository } from "../src/domain/repositories/ExpensesRepository";
import { ISpendingsRepository } from "../src/domain/repositories/SpendingsRepository";

const year = 2020;
const month = 0;

test('getBudgetPerDay should correctly calculate how many days in the current month', () => {
    const incomes = [29000];
    const expenses: number[] = [];

    const service = getBudgetService(incomes, expenses, []);

    const budgetPerDay = service.getBudgetPerDay(2020, 1);

    expect(budgetPerDay.toFixed(2)).toBe("1000.00");
})

test('getBudgetPerDay should calculate budget per day when both incomes and expenses are provided', () => {
    const incomes = [100000, 15000];
    const expenses = [75000, 5000, 10000];

    const service = getBudgetService(incomes, expenses, []);

    const budgetPerDay = service.getBudgetPerDay(year, month);

    expect(budgetPerDay.toFixed(2)).toBe("806.45");
})

test('getBudgetPerDay should return 0 when incomes and expenses are empty', () => {
    const service = getBudgetService([], [], []);

    const budgetPerDay = service.getBudgetPerDay(year, month);

    expect(budgetPerDay).toBe(0);
})

test('getBudgetPerDay should return a negative number when expenses are bigger than incomes', () => {
    const incomes: number[] = [1000];
    const expenses: number[] = [1000, 1500];

    const service = getBudgetService(incomes, expenses, []);

    const budgetPerDay = service.getBudgetPerDay(year, month);

    expect(budgetPerDay.toFixed(2)).toBe("-48.39");
})

test('getSaldos should return zeros when budgetPerDay is zero and now spendings added', () => {
    const service = getBudgetService([], [], []);

    const saldos = service.getSaldos(0, year, month);

    expect(saldos).toStrictEqual(new Array(31).fill(0));
})

test('getSaldos should return correct saldos', () => {
    const spendings = [
        { day: 1, amount: 150 },
        { day: 1, amount: 300 },
        { day: 2, amount: 400 },
        { day: 3, amount: 100 },
        { day: 4, amount: 50 },
        { day: 5, amount: 200 },
    ];

    const service = getBudgetService([], [], spendings);

    const saldos = service.getSaldos(500, year, month);

    const expected = [
        50, 150, 550, 1000, 1300, 1800, 2300, 2800, 3300, 3800,
        4300, 4800, 5300, 5800, 6300, 6800, 7300, 7800, 8300, 8800,
        9300, 9800, 10300, 10800, 11300, 11800, 12300, 12800, 13300, 13800, 14300
    ];

    expect(saldos).toStrictEqual(expected);
})

function getBudgetService(mockedIncomes: number[], mockedExpenses: number[], mockedSpendings: { day: number, amount: number }[]) {
    return new BudgetService(
        getIncomesRepositoryMock(mockedIncomes),
        getExpensesRepositoryMock(mockedExpenses),
        getSpendingsRepositoryMock(mockedSpendings)
    );
}

function getIncomesRepositoryMock(amounts: number[]): IIncomesRepository {
    return {
        // @ts-ignore
        get: () => amounts.map(amount => {
            return {
                year: year, month: month, amount: amount
            }
        })
    }
}

function getExpensesRepositoryMock(amounts: number[]): IExpensesRepository {
    return {
        // @ts-ignore
        get: () => amounts.map((amount) => {
            return {
                year: year, month: month, amount: amount
            }
        })
    }
}

function getSpendingsRepositoryMock(spendings: { day: number, amount: number }[]): ISpendingsRepository {
    return {
        // @ts-ignore
        get: () => spendings.map((spending) => {
            return {
                year: year, month: month, amount: spending.amount, day: spending.day
            }
        })
    }
}