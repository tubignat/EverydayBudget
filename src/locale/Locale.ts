export type Locale = {
    homePageTitle: string
    today: string
    todaysLimit: string
    addExpense: string

    settingsPageTitle: string
    incomes: string
    newIncome: string
    noIncomesYet: string
    recurringExpenses: string
    newExpense: string
    noExpensesYet: string
    add: string
    budgetPerDay: string
    description: string
    language: string
    currency: string
    website: string
    privacyPolicy: string

    todaysExpenses: string
    noExpensesToday: string
    totalExpensesToday: string

    statisticsPageTitle: string
    dateColumn: string
    saldoColumn: string
    budget: string
    saldos: string
    noSpendingForThisDay: string

    getDateText: (day: number, month: number) => string
    getDayOfWeekAbbr: (dayOfWeek: number) => string
}