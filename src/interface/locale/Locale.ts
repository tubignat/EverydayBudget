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
    cancel: string
    budgetPerDay: string
    startOfPeriod: string
    description: string
    language: string
    currency: string
    appearance: string
    website: string
    privacyPolicy: string
    daysOfWeek: string
    categories: string
    configureCategories: string
    categoriesAdditionalText: string
    categoryName: string
    categoryColor: string
    newCategoryName: string

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
    getDayOfWeek: (dayOfWeek: number) => string
    getDayOfWeekAbbr: (dayOfWeek: number) => string
    getMonthName: (month: number) => string
    getStartOfPeriodDateText: (day: number, month: number) => string
}