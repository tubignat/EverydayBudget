import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import SlidingUpPanel from './SlidingUpPanel';
import DayOfMonthSpendingsList from './DayOfMonthSpendingsList';
import { TextButton } from './TextButton';
import { ApplicationContext } from '../ApplicationContext';
import { formatMoney } from '../NumberFormat';
import { Spending, SpendingId } from '../../domain/repositories/SpendingsRepository';
import { ColorScheme } from '../color/ColorScheme';

const Window = Dimensions.get('window')

interface IDaysSpendingsPanel {
    closePanel: () => void
    month: number
    day: number
    budget: number
    saldo: number,
    spendings: Spending[],
    remove: (id: SpendingId) => void,
    edit: (id: SpendingId, amount: number) => void,
    add: (day: number) => void
}

export function DaysSpendingsPanel(props: IDaysSpendingsPanel) {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const { closePanel, day, month, budget, saldo, spendings, remove, edit, add } = props;
    const { locale, currency, colorScheme } = application;

    const styles = getStyles(colorScheme);

    return <SlidingUpPanel onClose={closePanel} offsetTop={Window.height / 4} backgroundColor={colorScheme.lightBackground}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
            <View style={styles.daySpendingHeader}>
                <Text style={styles.daySpendingDateText}>{locale.getDateText(day, month)}</Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>{locale.budget}</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: budget > 0 ? colorScheme.primaryText : colorScheme.danger
                }}>
                    {formatMoney(budget)} {currency}
                </Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>{locale.saldos}</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: saldo > 0 ? colorScheme.primaryText : colorScheme.danger
                }}>{formatMoney(saldo)} {currency}</Text>
            </View>
            {
                spendings.length > 0 &&
                <DayOfMonthSpendingsList spendings={spendings} remove={remove} edit={edit} add={() => add(day)} />
            }
            {
                spendings.length === 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>{locale.noSpendingForThisDay}</Text>
                    <TextButton text={locale.add} height={50} fontSize={15} onPress={() => add(day)} scheme={colorScheme} disabled={false} />
                </View>
            }
        </ScrollView>
    </SlidingUpPanel>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    emptyListTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginTop: 40
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15
    },
    daySpendingHeader: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginLeft: 20,
    },
    daySpendingDateText: {
        fontSize: 30,
        color: scheme.primaryText
    },
    daySpendingBudgetContainer: {
        flexDirection: 'row',
        marginLeft: 30,
        marginTop: 10
    },
    daySpendingBudgetText: {
        fontSize: 16,
        color: scheme.primaryText
    },
    daySpendingBudgetLabel: {
        fontSize: 16,
        width: 80,
        color: scheme.primaryText
    }
});