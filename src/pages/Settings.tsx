import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Linking } from 'react-native';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { IncomesList } from '../components/SettingsIncomesList';
import { IncomeId } from '../domain/IncomesRepository';
import { ExpenseId } from '../domain/ExpensesRepository';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';
import { ApplicationContext } from '../domain/ApplicationContext';
import { Application } from '../domain/Application';
import { SortButton } from '../components/SortButton';
import { formatMoney } from '../domain/NumberFormat';

@observer
export default class Settings extends Component<{}, {}, Application> {

    static contextType = ApplicationContext;
    context!: Application;

    render() {
        const application = this.context;
        const expenses = application.sortExpenses === 'desc'
            ? application.expenses.slice().sort((a, b) => b.amount - a.amount)
            : application.expenses;

        const incomes = application.sortIncomes === 'desc'
            ? application.incomes.slice().sort((a, b) => b.amount - a.amount)
            : application.incomes;

        return <Page>
            <KeyboardAvoidingView behavior='padding'>
                <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                    <View style={{ paddingBottom: 130 }}>
                        <Text style={styles.header}>{application.locale.settingsPageTitle}</Text>

                        <View style={styles.listSubheaderContainer}>
                            <Text style={styles.subheader}>{application.locale.incomes}</Text>
                            {
                                incomes.length > 1 &&
                                <SortButton
                                    onPress={() => application.changeSortIncomes(application.sortIncomes === 'none' ? 'desc' : 'none')}
                                    checked={application.sortIncomes !== 'none'}
                                />
                            }
                        </View>

                        <IncomesList
                            locale={application.locale}
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
                                expenses.length > 1 &&
                                <SortButton
                                    onPress={() => application.changeSortExpenses(application.sortExpenses === 'none' ? 'desc' : 'none')}
                                    checked={application.sortExpenses !== 'none'}
                                />
                            }
                        </View>

                        <IncomesList
                            locale={application.locale}
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

                        <View style={{ ...styles.inlineSettingContainer, marginTop: 40 }}>
                            <Text style={styles.subheader}>{application.locale.currency}</Text>
                            <CurrencySelector currency={application.currency} onChange={application.changeCurrency} />
                        </View>

                        <View style={{ ...styles.inlineSettingContainer, marginTop: -20 }}>
                            <Text style={styles.subheader}>{application.locale.language}</Text>
                            <LanguageSelector language={application.language} onChange={application.changeLanguage} />
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
                </ScrollView>
            </KeyboardAvoidingView>
        </Page>
    }


}

const styles = StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40
    },
    subheader: {
        color: 'gray',
        fontSize: 20,
        marginLeft: 15,
    },
    inlineSettingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40
    },
    budgetPerDayAmount: {
        fontSize: 22,
        marginRight: 20
    },
    linksContainer: {
        marginTop: 40,
        marginLeft: 15,
    },
    link: {
        fontSize: 15,
        color: 'gray',
        textDecorationLine: 'underline',
        paddingTop: 10,
        paddingBottom: 10,
    },
    listSubheaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 5,
        height: 35
    },
    sortButton: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderRadius: 10
    }
});