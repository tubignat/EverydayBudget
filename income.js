class Income {
    id;
    amount;
    description;
    year;
    month;
}

const incomeIdSeq = 0;
const incomes = [];

addIncome = (year, month, amount, description) => {
    incomeIdSeq++;

    const income = new Income();
    income.id = incomeIdSeq;
    income.amount = amount;
    income.description = description;
    income.year = year;
    income.month = month;

    incomes.push(income);
}

removeIncome = (id) => {
    const index = incomes.findIndex(i => i.id === id);
    incomes.splice(index, 1);
}

getIncomes = (year, month) => incomes.filter(i => i.year === year && i.month === month);