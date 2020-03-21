import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { Application } from '../domain/Application';
import { IncomesList } from '../components/SettingsIncomesList';
import { IncomeId } from '../domain/IncomesRepository';
import { ExpenseId } from '../domain/ExpensesRepository';

interface ISettingsProps {
    application: Application
}

@observer
export default class Settings extends Component<ISettingsProps> {

    constructor(props: ISettingsProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { application } = this.props;

        return <Page>
            <KeyboardAvoidingView behavior='padding'>
                <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                    <View style={{ paddingBottom: 130 }}>
                        <Text style={styles.header}>Настройки</Text>
                        <Text style={styles.subheader}>Доходы</Text>

                        <IncomesList
                            incomes={application.incomes}
                            thereAreNoValuesYetText={'Пока доходов нет. '}
                            onRemove={application.removeIncome}
                            onAmountChanged={(id: IncomeId, amount: number) => application.editIncome(id, amount, null)}
                            onDescriptionChanged={(id: IncomeId, description: string) => application.editIncome(id, null, description)}
                            onAdd={() => application.addIncome(0, 'Новый доход')}
                        />

                        <Text style={styles.subheader}>Регулярные расходы</Text>

                        <IncomesList
                            incomes={application.expenses}
                            thereAreNoValuesYetText={'Пока расходов нет. '}
                            onRemove={application.removeExpense}
                            onAmountChanged={(id: ExpenseId, amount: number) => application.editExpense(id, amount, null)}
                            onDescriptionChanged={(id: ExpenseId, description: string) => application.editExpense(id, null, description)}
                            onAdd={() => application.addExpense(0, 'Новый расход')}
                        />

                        <View style={styles.budgetPerDayContainer}>
                            <Text style={styles.subheader}>Бюджет на день</Text>
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