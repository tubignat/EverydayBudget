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
    startOfPeriod: 'Start this month',
    description: 'Description...',
    language: 'Language',
    currency: 'Currency',
    appearance: 'Appearance',
    website: 'Website',
    privacyPolicy: 'Privacy policy',
    daysOfWeek: 'MTWTFSS',

    todaysExpenses: 'Today',
    noExpensesToday: 'No spending today',
    totalExpensesToday: 'total',

    statisticsPageTitle: 'Statistics',
    dateColumn: 'Date',
    saldoColumn: 'Balance',
    budget: 'Budget',
    saldos: 'Remained',
    noSpendingForThisDay: 'No spending that day. ',
    add: 'Add',

    getDateText: (day: number, month: number) => {
        const suffix = getDateSuffix(day);
        return `${months[month]} ${day}${suffix}`
    },

    getDayOfWeek: (dayOfWeek: number) => daysOfWeek[dayOfWeek],

    getDayOfWeekAbbr: (dayOfWeek: number) => daysOfWeekAbbr[dayOfWeek],

    getMonthName: (month: number) => months[month],

    getStartOfPeriodDateText: (day: number, month: number) => {
        const suffix = getDateSuffix(day);
        return `on ${months[month].toLowerCase()} ${day}${suffix}`
    }
}

const getDateSuffix = (date: number) => {
    switch (date) {
        case 1:
            return 'st'
        case 2:
            return 'nd'
        case 3:
            return 'rd'
        default:
            return 'th'
    }
}

const months: { [month: number]: string } = {
    0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June',
    6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December',
}

const daysOfWeek: { [dayOfWeek: number]: string } = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'
}

const daysOfWeekAbbr: { [dayOfWeek: number]: string } = {
    0: 'su', 1: 'mo', 2: 'tu', 3: 'we', 4: 'th', 5: 'fr', 6: 'sa'
}