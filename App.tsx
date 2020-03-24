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
import { UserPreferencesRepository } from './src/domain/UserPreferencesRepository';
import { ApplicationContext } from './src/domain/ApplicationContext';
import { AppState, AppStateStatus, Image, View, Animated } from 'react-native';

@observer
export default class App extends Component<{}, {
    isScrollLocked: boolean, isInitialized: boolean, appState: AppStateStatus, protectScreenOpacity: Animated.Value, protectScreenDisplay: boolean
}> {

    private application: Application | undefined;

    constructor(props: {}) {
        super(props);
        this.state = {
            isScrollLocked: false,
            isInitialized: false,
            appState: AppState.currentState,
            protectScreenOpacity: new Animated.Value(0),
            protectScreenDisplay: false
        };

    }

    componentDidMount() {
        this.init();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
            this.application?.init();
            Animated
                .timing(this.state.protectScreenOpacity, { toValue: 0, duration: 200 })
                .start(() => this.setState({ protectScreenDisplay: false }));
        }

        if (nextAppState === 'inactive') {
            this.setState({ protectScreenDisplay: true });
            Animated
                .timing(this.state.protectScreenOpacity, { toValue: 1 })
                .start();
        }

        this.setState({ appState: nextAppState });
    };

    async init() {
        const spendingsRepository = new SpendingsRepository();
        const incomesRepository = new IncomesRepository();
        const expensesRepository = new ExpensesRepository();
        const setUpMonthsRepository = new SetUpMonthsRepository();
        const userPreferencesRepository = new UserPreferencesRepository();

        const ensureMonthIsSetUpService = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository);
        const budgetService = new BudgetService(incomesRepository, expensesRepository, spendingsRepository);

        this.application = new Application(
            incomesRepository,
            expensesRepository,
            spendingsRepository,
            userPreferencesRepository,
            ensureMonthIsSetUpService,
            budgetService);

        await spendingsRepository.init();
        await incomesRepository.init();
        await expensesRepository.init();
        await setUpMonthsRepository.init();
        await userPreferencesRepository.init();

        this.application.init();

        this.setState({ isInitialized: true });
    }

    render() {
        if (!this.application) {
            return null;
        }

        return (
            this.state.isInitialized &&
            <ApplicationContext.Provider value={this.application}>
                <Swiper loop={false} index={1} bounces={true} scrollEnabled={!this.state.isScrollLocked} showsPagination={!this.state.isScrollLocked}>
                    <Settings />
                    <Home />
                    <TodaySpendings />
                    <MonthSpendings
                        onModalOpen={() => this.setState({ isScrollLocked: true })}
                        onModalClose={() => this.setState({ isScrollLocked: false })}
                    />
                </Swiper>
                <Animated.View style={{
                    height: '100%', width: '100%', justifyContent: 'center',
                    alignItems: 'center', position: 'absolute', top: 0,
                    backgroundColor: 'white',
                    opacity: this.state.protectScreenOpacity,
                    display: this.state.protectScreenDisplay ? 'flex' : 'none'
                }}>
                    <Image source={require('./assets/icon.png')} style={{ width: 150, height: 150 }} />
                </Animated.View>
            </ApplicationContext.Provider>
        );
    }
}
