class Expense {
    id;
    amount;
    description;
    year;
    month;
}

let expenseIdSeq = 0;
const expenses = [];

addExpense = (year, month, amount, description) => {
    expenseIdSeq++;

    const expense = new Expense();
    expense.id = expenseIdSeq;
    expense.amount = amount;
    expense.description = description;
    expense.year = year;
    expense.month = month;

    expenses.push(expense);
}

removeExpense = (id) => {
    const index = expenses.findIndex(i => i.id === id);
    expenses.splice(index, 1);
}

getExpenses = (year, month) => expenses.filter(i => i.year === year && i.month === month);