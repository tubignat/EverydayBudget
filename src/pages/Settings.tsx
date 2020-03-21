import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { Application } from '../domain/Application';
import { IncomesList } from '../components/SettingsIncomesList';
import { IncomeId } from '../domain/IncomesRepository';
import { ExpenseId } from '../domain/ExpensesRepository';
import { Locale } from '../locale/Locale';

interface ISettingsProps {
    application: Application,
    locale: Locale
}

@observer
export default class Settings extends Component<ISettingsProps> {

    constructor(props: ISettingsProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { application, locale } = this.props;

        return <Page>
            <KeyboardAvoidingView behavior='padding'>
                <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                    <View style={{ paddingBottom: 130 }}>
                        <Text style={styles.header}>{locale.settingsPageTitle}</Text>
                        <Text style={styles.subheader}>{locale.incomes}</Text>

                        <IncomesList
                            locale={locale}
                            incomes={application.incomes}
                            thereAreNoValuesYetText={locale.noIncomesYet}
                            onRemove={application.removeIncome}
                            onAmountChanged={(id: IncomeId, amount: number) => application.editIncome(id, amount, null)}
                            onDescriptionChanged={(id: IncomeId, description: string) => application.editIncome(id, null, description)}
                            onAdd={() => application.addIncome(0, locale.newIncome)}
                        />

                        <Text style={styles.subheader}>{locale.recurringExpenses}</Text>

                        <IncomesList
                            locale={locale}
                            incomes={application.expenses}
                            thereAreNoValuesYetText={locale.noExpensesYet}
                            onRemove={application.removeExpense}
                            onAmountChanged={(id: ExpenseId, amount: number) => application.editExpense(id, amount, null)}
                            onDescriptionChanged={(id: ExpenseId, description: string) => application.editExpense(id, null, description)}
                            onAdd={() => application.addExpense(0, locale.newExpense)}
                        />

                        <View style={styles.budgetPerDayContainer}>
                            <Text style={styles.subheader}>{locale.budgetPerDay}</Text>
                            <Text style={styles.budgetPerDayAmount}>{application.budgetPerDay.toFixed(0)} &#8381;</Text>
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
    budgetPerDayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    budgetPerDayAmount: {
        fontSize: 22,
        marginRight: 20
    }
});