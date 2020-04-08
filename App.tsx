import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import Home from './src/interface/pages/Home';
import Settings from './src/interface/pages/Settings';
import TodaySpendings from './src/interface/pages/TodaySpendings';
import { SpendingsRepository } from './src/domain/repositories/SpendingsRepository';
import { observer } from 'mobx-react';
import { IncomesRepository } from './src/domain/repositories/IncomesRepository';
import { ExpensesRepository } from './src/domain/repositories/ExpensesRepository';
import { BudgetService } from './src/domain/services/BudgetService';
import { ApplicationState } from './src/interface/ApplicationState';
import MonthSpendings from './src/interface/pages/MonthSpendings';
import { SetUpMonthsRepository } from './src/domain/repositories/SetUpMonthsRepository';
import { EnsureMonthIsSetUpService } from './src/domain/services/EnsureMonthIsSetUpService';
import { UserPreferencesRepository } from './src/domain/repositories/UserPreferencesRepository';
import { ApplicationContext } from './src/interface/ApplicationContext';
import { AppState, AppStateStatus, Image, Animated, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

@observer
export default class App extends Component<{}, {
    isScrollLocked: boolean, isInitialized: boolean, appState: AppStateStatus, protectScreenOpacity: Animated.Value, protectScreenDisplay: boolean
}> {

    private applicationState: ApplicationState | undefined;

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
            this.applicationState?.init();
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
        await Font.loadAsync({
            'antoutline': require('./node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf')
        });

        const spendingsRepository = new SpendingsRepository();
        const incomesRepository = new IncomesRepository();
        const expensesRepository = new ExpensesRepository();
        const setUpMonthsRepository = new SetUpMonthsRepository();
        const userPreferencesRepository = new UserPreferencesRepository();

        const ensureMonthIsSetUpService = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository);
        const budgetService = new BudgetService(incomesRepository, expensesRepository, spendingsRepository);

        this.applicationState = new ApplicationState(
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

        this.applicationState.init();

        this.setState({ isInitialized: true });
    }

    render() {
        if (!this.applicationState) {
            return null;
        }

        return (
            this.state.isInitialized &&
            <ApplicationContext.Provider value={this.applicationState}>
                <Swiper
                    loop={false}
                    index={1}
                    bounces={true}
                    scrollEnabled={!this.state.isScrollLocked}
                    showsPagination={!this.state.isScrollLocked}
                    dotColor={this.applicationState.colorScheme.secondaryText}
                    activeDotColor={this.applicationState.colorScheme.primary}
                >
                    <Settings />
                    <Home />
                    <TodaySpendings />
                    <MonthSpendings
                        onModalOpen={() => this.setState({ isScrollLocked: true })}
                        onModalClose={() => this.setState({ isScrollLocked: false })}
                    />
                </Swiper>

                <View style={{
                    ...styles.background,
                    backgroundColor: this.applicationState.colorScheme.background
                }} />
                <Animated.View style={{
                    ...styles.protectingImage,
                    backgroundColor: this.applicationState.colorScheme.background,
                    opacity: this.state.protectScreenOpacity,
                    display: this.state.protectScreenDisplay ? 'flex' : 'none'
                }}>
                    <Image source={require('./assets/icon.png')} style={{ width: 150, height: 150 }} />
                </Animated.View>
            </ApplicationContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        zIndex: -1,
    },
    protectingImage: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
    }
})