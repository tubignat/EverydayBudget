import { Locale } from "./Locale";

export const ruLocale: Locale = {
    homePageTitle: 'Главная',
    today: 'сегодня',
    todaysLimit: 'Баланс',
    addExpense: 'Добавить трату',

    settingsPageTitle: 'Настройки',
    incomes: 'Доходы',
    newIncome: 'Новый доход',
    noIncomesYet: 'Пока доходов нет. ',
    recurringExpenses: 'Регулярный расходы',
    newExpense: 'Новый расход',
    noExpensesYet: 'Пока расходов нет. ',
    budgetPerDay: 'Бюджет на день',
    description: 'Описание...',
    language: 'Язык',
    currency: 'Валюта',
    website: 'Веб-сайт',
    privacyPolicy: 'Политика конфиденциальности',

    todaysExpenses: 'Траты за сегодня',
    noExpensesToday: 'За сегодня трат пока нет',
    totalExpensesToday: 'потрачено',

    statisticsPageTitle: 'Статистика',
    dateColumn: 'День',
    saldoColumn: 'Остаток',
    budget: 'Бюджет',
    saldos: 'Остаток',
    noSpendingForThisDay: 'За этот день трат нет. ',

    add: 'Добавить',

    getDateText: (day: number, month: number) => `${day} ${ruMonths[month]}`,

    getDayOfWeekAbbr: (dayOfWeek: number) => daysOfWeekAbbr[dayOfWeek]
}

const ruMonths: { [month: number]: string } = {
    0: 'января', 1: 'февраля', 2: 'марта', 3: 'апреля', 4: 'мая', 5: 'июня',
    6: 'июля', 7: 'августа', 8: 'сентября', 9: 'октября', 10: 'ноября', 11: 'декабря',
}

const daysOfWeekAbbr: { [month: number]: string } = {
    0: 'вс', 1: 'пн', 2: 'вт', 3: 'ср', 4: 'чт', 5: 'пт', 6: 'сб'
}