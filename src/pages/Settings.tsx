import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { IncomesList } from '../components/SettingsIncomesList';
import { IncomeId } from '../domain/IncomesRepository';
import { ExpenseId } from '../domain/ExpensesRepository';
import LanguageSelector from '../components/LanguageSelector';
import CurrencySelector from '../components/CurrencySelector';
import { ApplicationContext } from '../domain/ApplicationContext';

@observer
export default class Settings extends Component {

    static contextType = ApplicationContext;

    render() {
        const application = this.context;

        return <Page>
            <KeyboardAvoidingView behavior='padding'>
                <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                    <View style={{ paddingBottom: 130 }}>
                        <Text style={styles.header}>{application.locale.settingsPageTitle}</Text>
                        <Text style={styles.subheader}>{application.locale.incomes}</Text>

                        <IncomesList
                            locale={application.locale}
                            incomes={application.incomes}
                            thereAreNoValuesYetText={application.locale.noIncomesYet}
                            onRemove={application.removeIncome}
                            onAmountChanged={(id: IncomeId, amount: number) => application.editIncome(id, amount, null)}
                            onDescriptionChanged={(id: IncomeId, description: string) => application.editIncome(id, null, description)}
                            onAdd={() => application.addIncome(0, application.locale.newIncome)}
                        />

                        <Text style={styles.subheader}>{application.locale.recurringExpenses}</Text>

                        <IncomesList
                            locale={application.locale}
                            incomes={application.expenses}
                            thereAreNoValuesYetText={application.locale.noExpensesYet}
                            onRemove={application.removeExpense}
                            onAmountChanged={(id: ExpenseId, amount: number) => application.editExpense(id, amount, null)}
                            onDescriptionChanged={(id: ExpenseId, description: string) => application.editExpense(id, null, description)}
                            onAdd={() => application.addExpense(0, application.locale.newExpense)}
                        />

                        <View style={styles.inlineSettingContainer}>
                            <Text style={styles.subheader}>{application.locale.budgetPerDay}</Text>
                            <Text style={styles.budgetPerDayAmount}>{application.budgetPerDay.toFixed(0)} {application.currency}</Text>
                        </View>

                        <View style={{ ...styles.inlineSettingContainer, marginTop: 40 }}>
                            <Text style={styles.subheader}>{application.locale.currency}</Text>
                            <CurrencySelector currency={application.currency} onChange={application.changeCurrency} />
                        </View>

                        <View style={{ ...styles.inlineSettingContainer, marginTop: -20 }}>
                            <Text style={styles.subheader}>{application.locale.language}</Text>
                            <LanguageSelector language={application.language} onChange={application.changeLanguage} />
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
    }
});