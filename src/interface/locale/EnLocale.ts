import { Locale } from "./Locale";

export const enLocale: Locale = {
    homePageTitle: 'Home',
    today: 'today',
    todaysLimit: 'Balance',
    addExpense: 'Enter new expense',

    settingsPageTitle: 'Settings',
    incomes: 'Incomes',
    newIncome: 'New income',
    noIncomesYet: 'No incomes yet. ',
    recurringExpenses: 'Recurring expenses',
    newExpense: 'New expense',
    noExpensesYet: 'No expenses yet. ',
    budgetPerDay: 'Budget per day',
    description: 'Description...',
    language: 'Language',
    currency: 'Currency',
    website: 'Website',
    privacyPolicy: 'Privacy policy',

    todaysExpenses: 'Today\'s spending',
    noExpensesToday: 'No spending today',
    totalExpensesToday: 'total',

    statisticsPageTitle: 'Statistics',
    dateColumn: 'Date',
    saldoColumn: 'Balance',
    budget: 'Budget',
    saldos: 'Remained',
    noSpendingForThisDay: 'No spending that day. ',
    add: 'Add    ',

    getDateText: (day: number, month: number) => {
        if (day === 1) {
            return `${months[month]} 1st`
        }
        if (day === 2) {
            return `${months[month]} 2nd`
        }
        if (day === 3) {
            return `${months[month]} 3rd`
        }

        return `${months[month]} ${day}th`
    },

    getDayOfWeekAbbr: (dayOfWeek: number) => daysOfWeekAbbr[dayOfWeek]
}

const months: { [month: number]: string } = {
    0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June',
    6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December',
}

const daysOfWeekAbbr: { [month: number]: string } = {
    0: 'su', 1: 'mo', 2: 'tu', 3: 'we', 4: 'th', 5: 'fr', 6: 'sa'
}