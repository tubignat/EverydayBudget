export const getBudgetPerDay = (monthIncomes, monthExpenses, year, month) => {
    const daysInMonth = _daysInMonth(month, year);
    const totalIncome = monthIncomes.reduce((sum, currentValue) => sum + currentValue, 0);
    const totalExpense = monthExpenses.reduce((sum, currentValue) => sum + currentValue, 0);
    return (totalIncome - totalExpense) / daysInMonth;
}

export const getBudget = (budgetPerDay, getSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    let spendings = [];

    for (let i = 1; i < day; i++) { // budget for the given day does not take into account spendings in that day

        const spendingsForDay = getSpendings(year, month, i).map(s => s.amount);
        spendings = spendings.concat(spendingsForDay);
    }

    const totalSpendings = spendings.length > 0 ? spendings.reduce((sum, currentValue) => sum + currentValue) : 0;

    return budgetWithoutSpendings - totalSpendings;
}

export const getSaldo = (budgetPerDay, getSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    let spendings = [];

    for (let i = 1; i <= day; i++) { // saldo takes into account spendings for the given day

        const spendingsForDay = getSpendings(year, month, i).map(s => s.amount);
        spendings = spendings.concat(spendingsForDay);
    }

    const totalSpendings = spendings.length > 0 ? spendings.reduce((sum, currentValue) => sum + currentValue) : 0;

    return budgetWithoutSpendings - totalSpendings;
}


export function _daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}