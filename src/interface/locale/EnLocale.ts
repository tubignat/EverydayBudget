import {Locale} from "./Locale";

export const enLocale: Locale = {
    homePageTitle: 'Home',
    today: 'today',
    todaysLimit: 'Balance',
    addExpense: 'Enter new expense',
    erase: 'Erase',

    settingsPageTitle: 'Settings',
    incomes: 'Incomes',
    newIncome: 'New income',
    noIncomesYet: 'No incomes yet. ',
    recurringExpenses: 'Recurring expenses',
    expenses: 'Expenses',
    newExpense: 'New expense',
    noExpensesYet: 'No expenses yet. ',
    budgetPerDay: 'Budget per day',
    budgetForMonth: 'Budget for month',
    startOfPeriod: 'Start month',
    description: 'Description...',
    language: 'Language',
    currency: 'Currency',
    appearance: 'Appearance',
    website: 'Website',
    privacyPolicy: 'Privacy policy',
    daysOfWeek: 'MTWTFSS',
    categories: 'Categories',
    configureCategories: 'configure',
    categoriesAdditionalText: 'Categories list',
    categoryColor: 'Color',
    categoryName: 'Name',
    newCategoryName: 'New category',
    removeCategoryQuestion: 'Remove this category?',
    removeCategoryDialogMessage: 'Expenses with this category label will be labeled as "No category"',

    todayPageTitle: 'Today',
    noExpensesToday: 'No spending today',
    totalExpensesToday: 'total',

    dateColumn: 'Date',
    saldoColumn: 'Balance',
    budget: 'Budget',
    saldos: 'Remained',
    noSpendingForThisDay: 'No spending that day. ',
    add: 'Add',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    remove: 'Remove',

    noCategory: 'No category',
    category: 'Category',

    getDateText: (day: number, month: number) => {
        const suffix = getDateSuffix(day);
        return `${months[month]} ${day}${suffix}`
    },

    getDayOfWeek: (dayOfWeek: number) => daysOfWeek[dayOfWeek],

    getDayOfWeekAbbr: (dayOfWeek: number) => daysOfWeekAbbr[dayOfWeek],

    getMonthName: (month: number) => months[month],

    getMonthNameAbbr: month => monthsAbbr[month],

    getStartOfPeriodDateText: (day: number, month: number) => {
        const suffix = getDateSuffix(day);
        return `on ${months[month].toLowerCase()} ${day}${suffix}`
    },

    lunchCategory: 'Lunch',
    groceriesCategory: 'Groceries',
    householdCategory: 'Household',
    transportationCategory: 'Transportation',
    clothingCategory: 'Clothing',
    entertainmentCategory: 'Entertainment',
    restaurantsCategory: 'Restaurants',
    sportCategory: 'Sport',
    healthCategory: 'Health',
    otherCategory: 'Other',

    websiteURL: 'https://everydaybudget.app/en',
    canSpendToday: 'You can spend today',
    leftInMonth: 'Month budget',
    savedThisMonth: 'Saved this month',

    financesHeader: 'Finances',
    configureFinances: 'Configure',
    financesDescriptor: 'Settings',

    spendingsPageTitle: 'Expenses',
    statisticsPageTitle: 'Statistics',
    month: 'Month',
    allTime: 'All time',
    atTime: 'at',

    biggest: 'Biggest',
    smallest: 'Smallest',
    average: 'Average',
    daysWithPositiveLimit: 'Days with positive balance',


    distributionByCategories: 'By category',
    distributionByDaysOfWeek: 'By days of week',
    noData: 'No data',
    showNoCategory: 'Show \'No category\''
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

const monthsAbbr: { [month: number]: string } = {
    0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun',
    6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec',
}
const daysOfWeek: { [dayOfWeek: number]: string } = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'
}

const daysOfWeekAbbr: { [dayOfWeek: number]: string } = {
    0: 'su', 1: 'mo', 2: 'tu', 3: 'we', 4: 'th', 5: 'fr', 6: 'sa'
}
