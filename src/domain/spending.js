class Spending {
    id;
    amound;
    description;
    year;
    month;
    day;
}

const spendingIdSeq = 0;
const spendings = [];

addSpending = (year, month, amount, description, day) => {
    spendingIdSeq++;

    const spending = new Spending();
    spending.id = spendingIdSeq;
    spending.amount = amount;
    spending.description = description;
    spending.year = year;
    spending.month = month;
    spending.day = day;

    spendings.push(spending);
}

removeSpending = (id) => {
    const index = spendings.findIndex(i => i.id === id);
    spendings.splice(index, 1);
}

getSpendings = (year, month, day) => spendings.filter(i => i.year === year && i.month === month && i.day === day);