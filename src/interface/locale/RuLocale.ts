import { Locale } from "./Locale";

export const ruLocale: Locale = {
    homePageTitle: 'Главная',
    today: 'сегодня',
    todaysLimit: 'Баланс',
    addExpense: 'Добавить трату',
    erase: 'Стереть',

    settingsPageTitle: 'Настройки',
    incomes: 'Доходы',
    newIncome: 'Новый доход',
    noIncomesYet: 'Пока доходов нет. ',
    recurringExpenses: 'Регулярные расходы',
    expenses: 'Расходы',
    newExpense: 'Новый расход',
    noExpensesYet: 'Пока расходов нет. ',
    budgetPerDay: 'Бюджет на день',
    budgetForMonth: 'Бюджет на месяц',
    startOfPeriod: 'Начать месяц',
    description: 'Описание...',
    language: 'Язык',
    currency: 'Валюта',
    appearance: 'Тема',
    website: 'Веб-сайт',
    privacyPolicy: 'Политика конфиденциальности',
    daysOfWeek: 'ПВСЧПСВ',
    categories: 'Категории',
    configureCategories: 'настроить',
    categoriesAdditionalText: 'Список категорий',
    categoryColor: 'Цвет',
    categoryName: 'Название',
    newCategoryName: 'Новая категория',
    removeCategoryQuestion: 'Удалить категорию?',
    removeCategoryDialogMessage: 'Все траты по этой категории будут помечены как "Без категории"',

    todayPageTitle: 'Сегодня',
    noExpensesToday: 'За сегодня трат пока нет',
    totalExpensesToday: 'потрачено',

    dateColumn: 'День',
    saldoColumn: 'Остаток',
    budget: 'Бюджет',
    saldos: 'Остаток',
    noSpendingForThisDay: 'За этот день трат нет. ',

    add: 'Добавить',
    cancel: 'Отменить',
    close: 'Закрыть',
    remove: 'Удалить',
    save: 'Сохранить',

    noCategory: 'Без категории',
    category: 'Категория',

    getDateText: (day: number, month: number) => `${day} ${ruMonths[month]}`,

    getDayOfWeek: (dayOfWeek: number) => daysOfWeek[dayOfWeek],

    getDayOfWeekAbbr: (dayOfWeek: number) => daysOfWeekAbbr[dayOfWeek],

    getMonthName: (month: number) => monthNames[month],

    getStartOfPeriodDateText: (day: number, month: number) => `${day} ${ruMonths[month]}`,

    lunchCategory: 'Обед',
    groceriesCategory: 'Продукты',
    householdCategory: 'Дом, ремонт',
    transportationCategory: 'Транспорт',
    clothingCategory: 'Одежда',
    entertainmentCategory: 'Развлечения',
    restaurantsCategory: 'Рестораны и бары',
    sportCategory: 'Спорт',
    healthCategory: 'Здоровье',
    otherCategory: 'Другое',

    websiteURL: 'https://everydaybudget.app/ru',
    canSpendToday: 'Сегодня можно потратить',
    leftInMonth: 'Осталось на месяц',
    savedThisMonth: 'Сэкономлено',

    financesHeader: 'Финансы',
    configureFinances: 'Настроить',
    financesDescriptor: 'Настройки',
    spendingsPageTitle: 'Траты',
}

const monthNames: { [month: number]: string } = {
    0: 'Январь', 1: 'Февраль', 2: 'Март', 3: 'Апрель', 4: 'Май', 5: 'Июнь',
    6: 'Июль', 7: 'Август', 8: 'Сентябрь', 9: 'Октябрь', 10: 'Ноябрь', 11: 'Декабрь',
}

const ruMonths: { [month: number]: string } = {
    0: 'января', 1: 'февраля', 2: 'марта', 3: 'апреля', 4: 'мая', 5: 'июня',
    6: 'июля', 7: 'августа', 8: 'сентября', 9: 'октября', 10: 'ноября', 11: 'декабря',
}

const daysOfWeek: { [dayOfWeek: number]: string } = {
    0: 'Воскресенье', 1: 'Понедельник', 2: 'Вторник', 3: 'Среда', 4: 'Четверг', 5: 'Пятница', 6: 'Суббота'
}

const daysOfWeekAbbr: { [dayOfWeek: number]: string } = {
    0: 'вс', 1: 'пн', 2: 'вт', 3: 'ср', 4: 'чт', 5: 'пт', 6: 'сб'
}
