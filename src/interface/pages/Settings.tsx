import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Linking, Dimensions } from 'react-native';
import { Page } from '../components/Page'
import { observer } from 'mobx-react';
import { IncomesList } from '../components/SettingsIncomesList';
import { IncomeId } from '../../domain/repositories/IncomesRepository';
import { ExpenseId } from '../../domain/repositories/ExpensesRepository';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';
import { ApplicationContext } from '../ApplicationContext';
import { ApplicationState } from '../ApplicationState';
import { SortButton } from '../components/SortButton';
import { formatMoney } from '../NumberFormat';
import { ColorScheme } from '../color/ColorScheme';
import ColorSchemeSelector from '../components/ColorSchemeSelector';
import { TextButton } from '../components/TextButton';
import { DatePickerModal } from '../components/DatePickerModal/DatePickerModal';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

@observer
export default class Settings extends Component<{
    onModalOpen: () => void,
    onModalClose: () => void
}, {
    isPickerOpen: boolean,
    pickerModalOffsetY: number
}> {

    static contextType = ApplicationContext;
    context!: ApplicationState;

    constructor(props: any) {
        super(props);
        this.state = {
            isPickerOpen: false,
            pickerModalOffsetY: 0
        }
    }

    render() {
        const application = this.context;
        const styles = getStyles(application.colorScheme);

        const incomes = application.sortIncomes === 'desc'
            ? application.incomes.slice().sort((a, b) => b.amount - a.amount)
            : application.incomes;

        const showSortIncomesButton = this.canBeSorted(application.incomes.map(e => e.amount));

        const expenses = application.sortExpenses === 'desc'
            ? application.expenses.slice().sort((a, b) => b.amount - a.amount)
            : application.expenses;

        const showSortExpensesButton = this.canBeSorted(application.expenses.map(e => e.amount));

        return <View>
            <DatePickerModal
                scheme={application.colorScheme}
                isOpen={this.state.isPickerOpen}
                expansionPoint={{ x: isBigScreen ? width - 24 - 16 - 82 : width - 24 - 82, y: this.state.pickerModalOffsetY }}
                chosenDay={application.startOfPeriod}
                onBackdropClick={() => {
                    this.setState({ isPickerOpen: false });
                    this.props.onModalClose();
                }}
                onDateClick={day => {
                    this.setState({ isPickerOpen: false }, () => {
                        application.changeStartOfPeriod(day);
                        this.props.onModalClose();
                    });
                }}
            />
            <Page scheme={application.colorScheme}>
                <KeyboardAvoidingView behavior='padding'>
                    <ScrollView style={styles.pageContainer}>
                        <View style={{ paddingBottom: 130 }}>
                            <Text style={styles.header}>
                                {application.locale.settingsPageTitle}
                            </Text>

                            <View style={styles.pageContent}>
                                <View style={styles.listSubheaderContainer}>
                                    <Text style={styles.subheader}>
                                        {application.locale.incomes}
                                    </Text>
                                    {
                                        showSortIncomesButton &&
                                        <SortButton
                                            onPress={() => application.changeSortIncomes(application.sortIncomes === 'none' ? 'desc' : 'none')}
                                            checked={application.sortIncomes !== 'none'}
                                            scheme={application.colorScheme}
                                        />
                                    }
                                </View>

                                <IncomesList
                                    incomes={incomes}
                                    thereAreNoValuesYetText={application.locale.noIncomesYet}
                                    onRemove={application.removeIncome}
                                    onAmountChanged={(id: IncomeId, amount: number) => application.editIncome(id, amount, null)}
                                    onDescriptionChanged={(id: IncomeId, description: string) => application.editIncome(id, null, description)}
                                    onAdd={() => application.addIncome(0, application.locale.newIncome)}
                                />

                                <View style={styles.listSubheaderContainer}>
                                    <Text style={styles.subheader}>{application.locale.recurringExpenses}</Text>
                                    {
                                        showSortExpensesButton &&
                                        <SortButton
                                            onPress={() => application.changeSortExpenses(application.sortExpenses === 'none' ? 'desc' : 'none')}
                                            checked={application.sortExpenses !== 'none'}
                                            scheme={application.colorScheme}
                                        />
                                    }
                                </View>

                                <IncomesList
                                    incomes={expenses}
                                    thereAreNoValuesYetText={application.locale.noExpensesYet}
                                    onRemove={application.removeExpense}
                                    onAmountChanged={(id: ExpenseId, amount: number) => application.editExpense(id, amount, null)}
                                    onDescriptionChanged={(id: ExpenseId, description: string) => application.editExpense(id, null, description)}
                                    onAdd={() => application.addExpense(0, application.locale.newExpense)}
                                />

                                <View style={styles.inlineSettingContainer}>
                                    <Text style={styles.subheader}>{application.locale.budgetPerDay}</Text>
                                    <Text style={styles.budgetPerDayAmount}>{formatMoney(application.budgetPerDay)} {application.currency}</Text>
                                </View>

                                <View style={{ ...styles.inlineSettingContainer, marginTop: -8 }}>
                                    <Text style={styles.subheader}>{application.locale.startOfPeriod}</Text>
                                    <TextButton
                                        scheme={application.colorScheme}
                                        fontSize={20}
                                        height={22}
                                        disabled={false}
                                        text={application.locale.getStartOfPeriodDateText(application.startOfPeriod, application.month)}
                                        onPress={(position) => {
                                            this.setState({ isPickerOpen: true, pickerModalOffsetY: position.y });
                                            this.props.onModalOpen();
                                        }}
                                    />
                                </View>

                                <View style={{ ...styles.inlineSettingContainer, marginTop: 40 }}>
                                    <Text style={styles.subheader}>{application.locale.currency}</Text>
                                    <CurrencySelector currency={application.currency} onChange={application.changeCurrency} scheme={application.colorScheme} />
                                </View>

                                <View style={{ ...styles.inlineSettingContainer, marginTop: -20 }}>
                                    <Text style={styles.subheader}>{application.locale.language}</Text>
                                    <LanguageSelector language={application.language} onChange={application.changeLanguage} scheme={application.colorScheme} />
                                </View>

                                <View style={{
                                    ...styles.inlineSettingContainer, marginTop: 32,
                                    flexDirection: isSmallScreen ? 'column' : 'row',
                                    alignItems: isSmallScreen ? 'flex-start' : 'center',
                                    height: isSmallScreen ? 88 : 32
                                }}>
                                    <Text style={styles.subheader}>{application.locale.appearance}</Text>
                                    <ColorSchemeSelector
                                        preference={application.colorSchemePreference}
                                        onChange={application.changeColorSchemePreference}
                                        scheme={application.colorScheme}
                                    />
                                </View>

                                <View style={styles.linksContainer}>
                                    <Text style={styles.link} onPress={() => Linking.openURL('https://everydaybudget.app')}>
                                        {application.locale.website}
                                    </Text>
                                    <Text style={styles.link} onPress={() => Linking.openURL('https://everydaybudget.app/policy')}>
                                        {application.locale.privacyPolicy}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Page></View>
    }

    canBeSorted = (amounts: number[]) => {
        for (let i = 1; i < amounts.length; i++) {

            if (amounts[i] > amounts[i - 1]) {
                return true;
            }
        }

        return false;
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    pageContainer: {
        paddingLeft: 24,
        paddingRight: isSmallScreen ? 12 : 24,
        paddingVertical: isBigScreen ? 72 : 48,
    },
    pageContent: {
        paddingLeft: isSmallScreen ? 0 : 16,
        paddingRight: isBigScreen ? 16 : 0,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        height: 48,
        marginBottom: 48,
        color: scheme.primaryText,
    },
    subheader: {
        color: scheme.secondaryText,
        fontSize: 20,
    },
    inlineSettingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        height: 32,
    },
    budgetPerDayAmount: {
        fontSize: 22,
        color: scheme.primaryText
    },
    linksContainer: {
        marginTop: 40,
    },
    link: {
        fontSize: 15,
        color: scheme.secondaryText,
        textDecorationLine: 'underline',
        paddingTop: 10,
        paddingBottom: 10,
    },
    listSubheaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 32,
        marginBottom: 24,
    },
    sortButton: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 10
    }
})