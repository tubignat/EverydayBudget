import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import Home from './src/pages/Home';
import Settings from './src/pages/Settings';
import TodaySpendings from './src/pages/TodaySpendings';
import { SpendingsRepository } from './src/domain/SpendingsRepository';
import { observer } from './node_modules/mobx-react/dist/mobx-react';
import { IncomesRepository } from './src/domain/IncomesRepository';
import { ExpensesRepository } from './src/domain/ExpensesRepository';
import { BudgetService } from './src/domain/BudgetService';
import { Application } from './src/domain/Application';
import MonthSpendings from './src/pages/MonthSpendings';
import { SetUpMonthsRepository } from './src/domain/SetUpMonthsRepository';
import { EnsureMonthIsSetUpService } from './src/domain/EnsureMonthIsSetUpService';
import * as Localization from 'expo-localization';
import { Locale, getLocale } from './src/locale/Locale';

@observer
export default class App extends Component<{}, { isScrollLocked: boolean, isInitialized: boolean }> {

    private application: Application;
    private locale: Locale;

    constructor(props: {}) {
        super(props);
        this.state = {
            isScrollLocked: false,
            isInitialized: false
        };

        this.init();
    }

    async init() {
        const spendingsRepository = new SpendingsRepository();
        const incomesRepository = new IncomesRepository();
        const expensesRepository = new ExpensesRepository();
        const setUpMonthsRepository = new SetUpMonthsRepository();

        const ensureMonthIsSetUpService = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository);
        const budgetService = new BudgetService(incomesRepository, expensesRepository, spendingsRepository);

        this.application = new Application(incomesRepository, expensesRepository, spendingsRepository, ensureMonthIsSetUpService, budgetService);

        await spendingsRepository.init();
        await incomesRepository.init();
        await expensesRepository.init();
        await setUpMonthsRepository.init();

        this.application.init();

        this.locale = getLocale(Localization.locale);

        this.setState({ isInitialized: true });
    }

    render() {
        return (
            this.state.isInitialized &&
            <Swiper loop={false} index={1} bounces={true} scrollEnabled={!this.state.isScrollLocked} showsPagination={!this.state.isScrollLocked}>
                <Settings application={this.application} locale={this.locale} />
                <Home application={this.application} locale={this.locale} />
                <TodaySpendings application={this.application} locale={this.locale} />
                <MonthSpendings
                    application={this.application}
                    locale={this.locale}
                    onModalOpen={() => this.setState({ isScrollLocked: true })}
                    onModalClose={() => this.setState({ isScrollLocked: false })}
                />
            </Swiper>
        );
    }
}
