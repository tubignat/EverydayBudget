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
import { ColorScheme } from '../color/ColorScheme';
import { observer } from 'mobx-react';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface IDaysSpendingsPanel {
    onClose: () => void
    openedDay: number
}

export const DaysSpendingsPanel = observer((props: IDaysSpendingsPanel) => {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const { onClose: closePanel, openedDay } = props;
    const { locale, currency, colorScheme } = application;

    const budget = openedDay === application.startOfPeriod
        ? application.budgetPerDay
        : application.saldos[openedDay - 2] + application.budgetPerDay;

    const saldo = application.saldos[openedDay - 1];
    const spendings = application.spendings.filter(s => s.day === openedDay);
    const remove = application.removeSpending;
    const edit = application.editSpending;
    const add = () => application.addSpending(openedDay, 0, null, null);

    const styles = getStyles(colorScheme);

    return <SlidingUpPanel onClose={closePanel} offsetTop={isBigScreen ? 75 : 50} colorScheme={application.colorScheme}>
        <View style={styles.daySpendingHeader}>
            <Text style={styles.daySpendingDateText}>{locale.getDateText(openedDay, application.month)}</Text>
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
            <DayOfMonthSpendingsList spendings={spendings} remove={remove} edit={edit} add={add} />
        }
        {
            spendings.length === 0 &&
            <View style={styles.emptyListTextContainer}>
                <Text style={styles.emptyListText}>{locale.noSpendingForThisDay}</Text>
                <TextButton text={locale.add} height={50} fontSize={15} onPress={add} scheme={colorScheme} disabled={false} />
            </View>
        }
    </SlidingUpPanel>
});

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