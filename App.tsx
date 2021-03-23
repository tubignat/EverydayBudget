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
import {ApplicationContext, DevSettingsContext} from './src/interface/Contexts';
import {Alert, Animated, AppState, AppStateStatus, Image, NativeModules, StyleSheet, View} from 'react-native';
import * as Font from 'expo-font';
import {ModalStack} from './src/interface/components/common/ModalStack';
import {CategoryColorsRepository} from './src/domain/repositories/CategoryColorsRepository';
import {CategoriesRepository} from './src/domain/repositories/CategoriesRepository';
import {FirstTimeInitRepository} from './src/domain/repositories/FirstTimeInitRepository';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {IconFill} from "@ant-design/icons-react-native";
import {Spendings} from "./src/interface/components/Spendings/Spendings";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Statistics} from "./src/interface/components/Statistics/Statistics";
import {Locale} from "./src/interface/locale/Locale";
import {ColorScheme} from "./src/interface/color/ColorScheme";
import {FillGlyphMapType} from "@ant-design/icons-react-native/lib/fill";
import {DevSettingsRepository, FeatureFlag} from "./src/domain/repositories/DevSettingsRepository";
import {DevSettingsState} from "./src/interface/DevSettingsState";
import {TestDataProvider} from "./src/testData/TestDataProvider";
import {Repository} from "./src/domain/repositories/IRepository";
import {UserInfo} from "./src/domain/entities/UserInfo";
import {FileSystem} from "react-native-unimodules";

const Tab = createBottomTabNavigator()

@observer
export default class App extends Component<{}, {
    isInitialized: boolean,
    appState: AppStateStatus,
    protectScreenOpacity: Animated.Value,
    protectScreenDisplay: boolean
}> {

    private application: ApplicationState | undefined;
    private devSettings: DevSettingsState | undefined;

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
            this.application?.init();
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

    async migrateAsyncStorageIfNeeded() {
        const directory = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}`)
        if (directory.includes("RCTAsyncLocalStorage")) {
            await FileSystem.moveAsync({
                from: `${FileSystem.documentDirectory}/RCTAsyncLocalStorage`,
                to: `${FileSystem.documentDirectory}/RCTAsyncLocalStorage_V1`,
            })
        }
    }

    async init() {
        await this.migrateAsyncStorageIfNeeded()
        await Font.loadAsync({
            'antoutline': require('./node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf'),
            'antfill': require('./node_modules/@ant-design/icons-react-native/fonts/antfill.ttf'),
        })

        const colorsRepository = new CategoryColorsRepository();
        const categoriesRepository = new CategoriesRepository(colorsRepository);
        const spendingsRepository = new SpendingsRepository(categoriesRepository);
        const incomesRepository = new IncomesRepository();
        const expensesRepository = new ExpensesRepository();
        const setUpMonthsRepository = new SetUpMonthsRepository();
        const userPreferencesRepository = new UserPreferencesRepository();
        const firstTimeInitRepository = new FirstTimeInitRepository();
        const devSettingsRepository = new DevSettingsRepository();
        const userInfoRepository = new Repository<UserInfo>('userInfo_storage', (dto) => {
            return {
                created: dto?.created ? new Date(dto.created) : new Date(),
                seenEvents: dto?.seenEvents ?? []
            }
        })

        const ensureMonthIsSetUpService = new EnsureMonthIsSetUpService(incomesRepository, expensesRepository, setUpMonthsRepository);
        const budgetService = new BudgetService(incomesRepository, expensesRepository, spendingsRepository);
        const defaultCategoriesService = new DefaultCategoriesService(firstTimeInitRepository, categoriesRepository, colorsRepository);

        const testDataProvider = new TestDataProvider(
            incomesRepository,
            expensesRepository,
            spendingsRepository,
            categoriesRepository,
            colorsRepository
        )

        this.application = new ApplicationState(
            incomesRepository,
            expensesRepository,
            spendingsRepository,
            setUpMonthsRepository,
            userPreferencesRepository,
            categoriesRepository,
            colorsRepository,
            userInfoRepository,
            ensureMonthIsSetUpService,
            budgetService,
            defaultCategoriesService
        );

        this.devSettings = new DevSettingsState(devSettingsRepository, testDataProvider)

        await categoriesRepository.init();
        await spendingsRepository.init();
        await incomesRepository.init();
        await expensesRepository.init();
        await setUpMonthsRepository.init();
        await userPreferencesRepository.init();
        await firstTimeInitRepository.init();
        await devSettingsRepository.init();
        await userInfoRepository.init();

        this.application.init();
        this.devSettings.init();

        this.setState({isInitialized: true});
    }

    render() {
        if (!this.application || !this.devSettings || !this.state.isInitialized) {
            return null;
        }

        const appScreens: AppScreen[] = [
            {name: 'Home', component: Home, icon: 'home', label: this.application.locale.homePageTitle},
            {name: 'Spendings', component: Spendings, icon: 'profile', label: this.application.locale.spendingsPageTitle},
            {
                name: 'Statistics',
                component: Statistics,
                icon: 'pie-chart',
                label: this.application.locale.statisticsPageTitle,
            },
            {name: 'Settings', component: Settings, icon: 'setting', label: this.application.locale.settingsPageTitle},
        ]

        return (
            <SafeAreaProvider>
                <ApplicationContext.Provider value={this.application}>
                    <DevSettingsContext.Provider value={this.devSettings}>
                        <ModalStack colorScheme={this.application.colorScheme}>
                            <AppNavigation
                                isDarkTheme={this.application.isDarkTheme}
                                locale={this.application.locale}
                                scheme={this.application.colorScheme}
                                screens={appScreens}
                            />
                        </ModalStack>

                        <View style={{
                            ...styles.background,
                            backgroundColor: this.application.colorScheme.background
                        }}/>
                        <Animated.View style={{
                            ...styles.protectingImage,
                            backgroundColor: this.application.colorScheme.background,
                            opacity: this.state.protectScreenOpacity,
                            display: this.state.protectScreenDisplay ? 'flex' : 'none'
                        }}>
                            <Image source={require('./assets/protection_screen_icon.png')} style={{width: 120, height: 120}}/>
                        </Animated.View>
                    </DevSettingsContext.Provider>
                </ApplicationContext.Provider>
            </SafeAreaProvider>
        );
    }
}

interface AppScreen {
    name: string
    label: string
    component: React.ComponentType<any>
    icon: FillGlyphMapType
    hidden?: boolean
}

function AppNavigation(props: {
    isDarkTheme: boolean,
    locale: Locale,
    scheme: ColorScheme,
    screens: AppScreen[]
}) {
    return <NavigationContainer theme={props.isDarkTheme ? DarkTheme : DefaultTheme}>
        <Tab.Navigator sceneContainerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            {
                props.screens.filter(s => !s.hidden).map(s => {
                    const options = {
                        tabBarLabel: s.label,
                        tabBarIcon: ({focused}: { focused: boolean }) => {
                            const color = focused ? props.scheme.primary : props.scheme.alternativeSecondaryText
                            return <IconFill name={s.icon} color={color} size={24}/>
                        },
                    }

                    return <Tab.Screen key={s.name} name={s.name} component={s.component} options={options}/>
                })
            }
        </Tab.Navigator>
    </NavigationContainer>
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
