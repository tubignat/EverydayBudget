export type Locale = {
    homePageTitle: string
    today: string
    todaysLimit: string
    addExpense: string
    erase: string

    settingsPageTitle: string
    incomes: string
    newIncome: string
    noIncomesYet: string
    recurringExpenses: string
    expenses: string
    newExpense: string
    noExpensesYet: string
    add: string
    close: string
    cancel: string
    remove: string
    save: string
    budgetPerDay: string
    budgetForMonth: string
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
    removeCategoryQuestion: string
    removeCategoryDialogMessage: string

    todayPageTitle: string
    noExpensesToday: string
    totalExpensesToday: string

    dateColumn: string
    saldoColumn: string
    budget: string
    saldos: string
    noSpendingForThisDay: string
    noCategory: string
    category: string

    getDateText: (day: number, month: number) => string
    getDayOfWeek: (dayOfWeek: number) => string
    getDayOfWeekAbbr: (dayOfWeek: number) => string
    getMonthName: (month: number) => string
    getStartOfPeriodDateText: (day: number, month: number) => string

    lunchCategory: string
    groceriesCategory: string
    householdCategory: string
    transportationCategory: string
    clothingCategory: string
    entertainmentCategory: string
    restaurantsCategory: string
    sportCategory: string
    healthCategory: string
    otherCategory: string

    websiteURL: string
    canSpendToday: string
    leftInMonth: string
    savedThisMonth: string

    financesHeader: string
    configureFinances: string
    financesDescriptor: string

    spendingsPageTitle: string
}
