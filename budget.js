getBudgetPerDay = (monthIncomes, monthExpenses, year, month) => {
    const daysInMonth = _daysInMonth(month, year);
    const totalIncome = monthIncomes.reduce((sum, currentValue) => sum + currentValue);
    const totalExpense = monthExpenses.reduce((sum, currentValue) => sum + currentValue);
    return (totalIncome - totalExpense) / daysInMonth;
}

getBudget = (budgetPerDay, getSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    const spendings = [];

    for (let i = 1; i < day; i++) { // budget for the given day does not take into account spendings in that day

        const spendingsForDay = getSpendings(year, month, i).map(s => s.amount);
        spendings = spendings.concat(spendingsForDay);
    }

    const totalSpendings = spendings.reduce((sum, currentValue) => sum + currentValue);

    return budgetWithoutSpendings - totalSpendings;
}

getSaldo = (budgetPerDay, getSpendings, year, month, day) => {
    const budgetWithoutSpendings = budgetPerDay * day;
    const spendings = [];

    for (let i = 1; i <= day; i++) { // saldo takes into account spendings for the given day

        const spendingsForDay = getSpendings(year, month, i).map(s => s.amount);
        spendings = spendings.concat(spendingsForDay);
    }

    const totalSpendings = spendings.reduce((sum, currentValue) => sum + currentValue);

    return budgetWithoutSpendings - totalSpendings;
}


function _daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}