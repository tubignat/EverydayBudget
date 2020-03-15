export const getBudgetPerDay = (monthIncomes, monthExpenses, year, month) => {
    const daysInMonth = _daysInMonth(month, year);
    const totalIncome = monthIncomes.reduce((sum, currentValue) => sum + currentValue, 0);
    const totalExpense = monthExpenses.reduce((sum, currentValue) => sum + currentValue, 0);
    return (totalIncome - totalExpense) / daysInMonth;
};

export const getBudget = (budgetPerDay, getSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    let spendings = [];

    for (let i = 1; i < day; i++) { // budget for the given day does not take into account spendings in that day

        const spendingsForDay = getSpendings(year, month, i).map(s => s.amount);
        spendings = spendings.concat(spendingsForDay);
    }

    const totalSpendings = spendings.length > 0 ? spendings.reduce((sum, currentValue) => sum + currentValue) : 0;

    return budgetWithoutSpendings - totalSpendings;
};

export const getSaldo = (budgetPerDay, allSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    const spendings = allSpendings.filter(s => s.year === year && s.month === month && s.day <= day).map(s => s.amount);

    const totalSpendings = spendings.length > 0 ? spendings.reduce((sum, currentValue) => sum + currentValue) : 0;

    return budgetWithoutSpendings - totalSpendings;
};

export const getSaldosForMonth = (budgetPerDay, allSpendings, year, month, daysInMonth) => {
    const monthSpendings = allSpendings.filter(s => s.year === year && s.month === month).sort((a, b) => a.day - b.day);

    let saldos = [];

    let dayIterator = 0;
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


export function _daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}