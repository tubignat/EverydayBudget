import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {IncomesList} from './SettingsIncomesList';
import {IncomeId} from '../../../../domain/repositories/IncomesRepository';
import {ExpenseId} from '../../../../domain/repositories/ExpensesRepository';
import {ApplicationContext} from '../../../Contexts';
import {SortButton} from './SortButton';
import {ColorScheme} from '../../../color/ColorScheme';
import {useContextUnsafe} from "../../../Hooks";

export const BudgetSettings = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

    const styles = getStyles(application.colorScheme);

    const incomes = application.sortIncomes === 'desc'
        ? application.monthIncomes.slice().sort((a, b) => b.amount - a.amount)
        : application.monthIncomes;

    const showSortIncomesButton = canBeSorted(application.monthIncomes.map(e => e.amount));

    const expenses = application.sortExpenses === 'desc'
        ? application.monthExpenses.slice().sort((a, b) => b.amount - a.amount)
        : application.monthExpenses;

    const showSortExpensesButton = canBeSorted(application.monthExpenses.map(e => e.amount));
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
