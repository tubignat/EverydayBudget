import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { IncomesList } from './SettingsIncomesList';
import { IncomeId } from '../../../../domain/repositories/IncomesRepository';
import { ExpenseId } from '../../../../domain/repositories/ExpensesRepository';
import { ApplicationContext } from '../../../ApplicationContext';
import { SortButton } from './SortButton';
import { formatMoney } from '../../../NumberFormat';
import { ColorScheme } from '../../../color/ColorScheme';

export const BudgetSettings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    const incomes = application.sortIncomes === 'desc'
        ? application.incomes.slice().sort((a, b) => b.amount - a.amount)
        : application.incomes;

    const showSortIncomesButton = canBeSorted(application.incomes.map(e => e.amount));

    const expenses = application.sortExpenses === 'desc'
        ? application.expenses.slice().sort((a, b) => b.amount - a.amount)
        : application.expenses;

    const showSortExpensesButton = canBeSorted(application.expenses.map(e => e.amount));
    return <View style={styles.container}>
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
    </View>

    function canBeSorted(amounts: number[]) {
        for (let i = 1; i < amounts.length; i++) {

            if (amounts[i] > amounts[i - 1]) {
                return true;
            }
        }

        return false;
    }
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16
    },
    subheader: {
        color: scheme.secondaryText,
        fontSize: 20,
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
