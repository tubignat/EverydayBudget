import React, {Component} from 'react';
import {Home} from './src/interface/components/Home/Home';
import Settings from './src/interface/components/Settings/Settings';
import {SpendingsRepository} from './src/domain/repositories/SpendingsRepository';
import {observer} from 'mobx-react';
import {IncomesRepository} from './src/domain/repositories/IncomesRepository';
import {ExpensesRepository} from './src/domain/repositories/ExpensesRepository';
import {BudgetService} from './src/domain/services/BudgetService';
import {ApplicationState} from './src/interface/ApplicationState';
import {SetUpMonthsRepository} from './src/domain/repositories/SetUpMonthsRepository';
import {EnsureMonthIsSetUpService} from './src/domain/services/EnsureMonthIsSetUpService';
import {DefaultCategoriesService} from './src/domain/services/DefaultCategoriesService';
import {UserPreferencesRepository} from './src/domain/repositories/UserPreferencesRepository';
import {ApplicationContext} from './src/interface/ApplicationContext';
import {AppState, AppStateStatus, Image, Animated, View, StyleSheet} from 'react-native';
import * as Font from 'expo-font';
import {ModalStack} from './src/interface/components/common/ModalStack';
import {CategoryColorsRepository} from './src/domain/repositories/CategoryColorsRepository';
import {CategoriesRepository} from './src/domain/repositories/CategoriesRepository';
import {FirstTimeInitRepository} from './src/domain/repositories/FirstTimeInitRepository';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {IconFill} from "@ant-design/icons-react-native";
import {Spendings} from "./src/interface/components/Spendings/Spendings";
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator()

@observer
export default class App extends Component<{}, {
    isInitialized: boolean,
    appState: AppStateStatus,
    protectScreenOpacity: Animated.Value,
    protectScreenDisplay: boolean
}> {

    private applicationState: ApplicationState | undefined;

    constructor(props: {}) {
        super(props);
        this.state = {
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
                .timing(this.state.protectScreenOpacity, {toValue: 0, duration: 200, useNativeDriver: false})
                .start(() => this.setState({protectScreenDisplay: false}));
        }

        if (nextAppState === 'inactive') {
            this.setState({protectScreenDisplay: true});
            Animated
                .timing(this.state.protectScreenOpacity, {toValue: 1, useNativeDriver: false})
                .start();
        }

        this.setState({appState: nextAppState});
    };

    async init() {
        await Font.loadAsync({
            'antoutline': require('./node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf'),
            'antfill': require('./node_modules/@ant-design/icons-react-native/fonts/antfill.ttf'),
        });

        const colorsRepository = new CategoryColorsRepository();
        const categoriesRepository = new CategoriesRepository(colorsRepository);
        const spendingsRepository = new SpendingsRepository(categoriesRepository);
        const incomesRepository = new IncomesRepository();
        const expensesRepository = new ExpensesRepository();
        const setUpMonthsRepository = new SetUpMonthsRepository();
        const userPreferencesRepository = new UserPreferencesRepository();
        const firstTimeInitRepository = new FirstTimeInitRepository();

        const ensureMonthIsSetUpService = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository);
        const budgetService = new BudgetService(incomesRepository, expensesRepository, spendingsRepository);
        const defaultCategoriesService = new DefaultCategoriesService(firstTimeInitRepository, categoriesRepository, colorsRepository);

        this.applicationState = new ApplicationState(
            incomesRepository,
            expensesRepository,
            spendingsRepository,
            setUpMonthsRepository,
            userPreferencesRepository,
            categoriesRepository,
            colorsRepository,
            ensureMonthIsSetUpService,
            budgetService,
            defaultCategoriesService
        );

        await categoriesRepository.init();
        await spendingsRepository.init();
        await incomesRepository.init();
        await expensesRepository.init();
        await setUpMonthsRepository.init();
        await userPreferencesRepository.init();
        await firstTimeInitRepository.init();
        //
        // new TestDataProvider(
        //     incomesRepository,
        //     expensesRepository,
        //     spendingsRepository,
        //     categoriesRepository,
        //     colorsRepository
        // ).fillTestDataRussian(2020, 11, 10)

        this.applicationState.init();

        this.setState({isInitialized: true});
    }

    render() {
        if (!this.applicationState) {
            return null;
        }

        return (
            this.state.isInitialized &&
            <SafeAreaProvider>
                <ApplicationContext.Provider value={this.applicationState}>
                    <ModalStack colorScheme={this.applicationState.colorScheme}>
                        <NavigationContainer theme={this.applicationState.isDarkTheme ? DarkTheme : DefaultTheme}>
                            <Tab.Navigator sceneContainerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                                <Tab.Screen
                                    name='Home'
                                    component={Home}
                                    options={{
                                        tabBarLabel: this.applicationState?.locale.homePageTitle,
                                        tabBarIcon: (props) => <IconFill name='home' color={this.iconColor(props.focused)} size={24}/>
                                    }}
                                />
                                <Tab.Screen
                                    name='Expenses'
                                    component={Spendings}
                                    options={{
                                        tabBarLabel: this.applicationState?.locale.spendingsPageTitle,
                                        tabBarIcon: (props) => <IconFill name='profile' color={this.iconColor(props.focused)} size={24}/>
                                    }}
                                />
                                <Tab.Screen
                                    name='Settings'
                                    component={Settings}
                                    options={{
                                        tabBarLabel: this.applicationState?.locale.settingsPageTitle,
                                        tabBarIcon: (props) => <IconFill name='setting' color={this.iconColor(props.focused)} size={24}/>
                                    }}
                                />
                            </Tab.Navigator>
                        </NavigationContainer>
                    </ModalStack>

                    <View style={{
                        ...styles.background,
                        backgroundColor: this.applicationState.colorScheme.background
                    }}/>
                    <Animated.View style={{
                        ...styles.protectingImage,
                        backgroundColor: this.applicationState.colorScheme.background,
                        opacity: this.state.protectScreenOpacity,
                        display: this.state.protectScreenDisplay ? 'flex' : 'none'
                    }}>
                        <Image source={require('./assets/protection_screen_icon.png')} style={{width: 120, height: 120}}/>
                    </Animated.View>
                </ApplicationContext.Provider>
            </SafeAreaProvider>
        );
    }

    iconColor = (focused: boolean) => focused ? this.applicationState?.colorScheme.primary : this.applicationState?.colorScheme.alternativeSecondaryText
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
