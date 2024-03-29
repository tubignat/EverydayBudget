import { EnsureMonthIsSetUpService } from "../src/domain/services/EnsureMonthIsSetUpService";
import { IIncomesRepository, Income } from "../src/domain/repositories/IncomesRepository";
import { IExpensesRepository, Expense } from "../src/domain/repositories/ExpensesRepository";
import { ISetUpMonthsRepository, MonthSetUp } from "../src/domain/repositories/SetUpMonthsRepository";

test('ensureMonthIsSetUp should fill incomes and expenses from the previous month if it is not set up', () => {
    const incomesRepository = new IncomesRepositoryStub({ year: 2020, month: 0 });
    const expensesRepository = new ExpensesRepositoryStub({ year: 2020, month: 0 });
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, 1, 1)

    expect(incomesRepository.incomes).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 1 }
    ])

    expect(expensesRepository.expenses).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 1 },
    ])

    expect(setUpMonthsRepository.markedYear).toBe(2020)
    expect(setUpMonthsRepository.markedMonth).toBe(1)
})

test('ensureMonthIsSetUp should not fill incomes and expenses if month is set up', () => {
    const incomesRepository = new IncomesRepositoryStub({ year: 2020, month: 0 });
    const expensesRepository = new ExpensesRepositoryStub({ year: 2020, month: 0 });
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(true);

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, 1, 1)

    expect(incomesRepository.incomes).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
    ])

    expect(expensesRepository.expenses).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
    ])

    expect(setUpMonthsRepository.markedYear).toBe(0)
    expect(setUpMonthsRepository.markedMonth).toBe(0)
})

test('ensureMonthIsSetUp should not fill when there are incomes or expenses in current month even if month is not set up', () => {
    const incomesRepository = new IncomesRepositoryStub({ year: 2020, month: 0 }, { year: 2020, month: 1 });
    const expensesRepository = new ExpensesRepositoryStub({ year: 2020, month: 0 }, { year: 2020, month: 1 });
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, 1, 1)

    expect(incomesRepository.incomes).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 1 }
    ])

    expect(expensesRepository.expenses).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 1 }
    ])

    expect(setUpMonthsRepository.markedYear).toBe(0)
    expect(setUpMonthsRepository.markedMonth).toBe(0)
})

test('ensureMonthIsSetUp should fill from previous year if current month is january', () => {
    const incomesRepository = new IncomesRepositoryStub({ year: 2019, month: 11 });
    const expensesRepository = new ExpensesRepositoryStub({ year: 2019, month: 11 });
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, 0, 1)

    expect(incomesRepository.incomes).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2019, month: 11 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 }
    ])

    expect(expensesRepository.expenses).toStrictEqual([
        { id: 0, description: '', amount: 10000, year: 2019, month: 11 },
        { id: 0, description: '', amount: 10000, year: 2020, month: 0 }
    ])

    expect(setUpMonthsRepository.markedYear).toBe(2020)
    expect(setUpMonthsRepository.markedMonth).toBe(0)
})

test('ensureMonthIsSetUp should set start of period to today if previous month is not set up', () => {
    const incomesRepository = new IncomesRepositoryStub();
    const expensesRepository = new ExpensesRepositoryStub();
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const currentMonth = 3;

    setUpMonthsRepository.isMonthSetUp = (year: number, month: number) => false;

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, currentMonth, 15)

    expect(setUpMonthsRepository.markedYear).toBe(2020)
    expect(setUpMonthsRepository.markedMonth).toBe(currentMonth)
    expect(setUpMonthsRepository.markedStartOfPeriod).toBe(15)
})

test('ensureMonthIsSetUp should set start of period to 1 if previous month is set up', () => {
    const incomesRepository = new IncomesRepositoryStub();
    const expensesRepository = new ExpensesRepositoryStub();
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const currentMonth = 3;

    setUpMonthsRepository.isMonthSetUp = (year: number, month: number) => month === currentMonth - 1;

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, currentMonth, 15)

    expect(setUpMonthsRepository.markedYear).toBe(2020)
    expect(setUpMonthsRepository.markedMonth).toBe(currentMonth)
    expect(setUpMonthsRepository.markedStartOfPeriod).toBe(1)
})

test('ensureMonthIsSetUp reset startOfPeriod to today if startOfPeriod is bigger than today', () => {
    const incomesRepository = new IncomesRepositoryStub();
    const expensesRepository = new ExpensesRepositoryStub();
    const setUpMonthsRepository = new SetUpMonthsRepositoryStub(false);

    const currentMonth = 3;

    setUpMonthsRepository.isMonthSetUp = (year: number, month: number) => true;
    setUpMonthsRepository.getMonthSetUp = (year: number, month: number) => {
        return {
            startOfPeriod: 20,
            year: year,
            month: month
        }
    };

    let editedMonthSetup: any = {}

    setUpMonthsRepository.editMonthSetUp = (year: number, month: number, startOfPeriod: number) => {
        editedMonthSetup = {
            year: year,
            month: month,
            startOfPeriod: startOfPeriod
        };
    };

    const service = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository)

    service.ensureMonthIsSetUp(2020, currentMonth, 15)

    expect(editedMonthSetup.year).toBe(2020)
    expect(editedMonthSetup.month).toBe(currentMonth)
    expect(editedMonthSetup.startOfPeriod).toBe(15)
})

class IncomesRepositoryStub implements IIncomesRepository {

    public incomes: Income[] = [];

    constructor(...incomes: { year: number, month: number }[]) {
        this.incomes = incomes.map(i => {
            return { id: 0, description: '', amount: 10000, year: i.year, month: i.month }
        })
    }

    addMany = (year: number, month: number, incomes: { description: string, amount: number }[]) => {
        incomes.forEach(i => this.incomes.push({
            id: 0, description: '', amount: i.amount, year: year, month: month
        }))
    }

    get = (year: number, month: number) => this.incomes.filter(i => i.year === year && i.month === month);

    add = (year: number, month: number, description: string, amount: number) => undefined;
    edit = (id: number, description: string | null, amount: number | null) => undefined;
    remove = (id: number) => undefined;
    init = () => undefined;
}

class ExpensesRepositoryStub implements IExpensesRepository {

    public expenses: Expense[] = [];

    constructor(...expenses: { year: number, month: number }[]) {
        this.expenses = expenses.map(i => {
            return { id: 0, description: '', amount: 10000, year: i.year, month: i.month }
        })
    }

    addMany = (year: number, month: number, expenses: { description: string, amount: number }[]) => {
        expenses.forEach(i => this.expenses.push({
            id: 0, description: '', amount: i.amount, year: year, month: month
        }))
    }
    get = (year: number, month: number) => this.expenses.filter(i => i.year === year && i.month === month);

    add = (year: number, month: number, description: string, amount: number) => undefined;
    edit = (id: number, description: string | null, amount: number | null) => undefined;
    remove = (id: number) => undefined;
    init = () => undefined;
}

class SetUpMonthsRepositoryStub implements ISetUpMonthsRepository {

    public markedYear = 0;
    public markedMonth = 0;
    public markedStartOfPeriod = 0;

    private isMonthSetUpField = false;

    constructor(isMonthSetUp: boolean) {
        this.isMonthSetUpField = isMonthSetUp;
    }

    editMonthSetUp = (year: number, month: number, startOfPeriod: number) => { };

    getMonthSetUp = (year: number, month: number) => {
        return {
            startOfPeriod: 1,
            year: year,
            month: month
        }
    };

    markMonthAsSetUp = (year: number, month: number, startOfPeriod: number) => {
        this.markedYear = year;
        this.markedMonth = month;
        this.markedStartOfPeriod = startOfPeriod;
    };

    isMonthSetUp = (year: number, month: number) => this.isMonthSetUpField;

    init = () => undefined
}