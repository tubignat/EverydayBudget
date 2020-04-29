import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Page } from '../common/Page'
import { observer } from 'mobx-react';
import { ApplicationContext } from '../../ApplicationContext';
import { formatMoney } from '../../NumberFormat';
import { ColorScheme } from '../../color/ColorScheme';
import { AddTransactionPlate } from './AddTransactionPlate';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const Home = observer(() => {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);
    const budgetColor = application.todaysLimit < 0
        ? application.colorScheme.danger
        : application.colorScheme.primaryText;

    const deltaColor = application.todaysDelta < 0
        ? application.colorScheme.danger
        : application.colorScheme.success

    return <Page scheme={application.colorScheme}>
        {
            !isSmallScreen && <View style={styles.headerContainer}>
                <Text style={styles.header}>
                    {application.locale.homePageTitle}
                </Text>
            </View>
        }
        <View style={styles.keyboardGroupContainer}>

            <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>
                    {application.locale.todaysLimit}
                </Text>
                <View style={styles.budgetAmounts}>
                    <Text style={{ ...styles.budget, color: budgetColor }}>
                        {formatMoney(application.todaysLimit)} {application.currency}
                    </Text>
                    <Text style={{ ...styles.deltaAmount, color: deltaColor }}>
                        {application.todaysDelta > 0 ? '+' : ''}{formatMoney(application.todaysDelta)} {application.currency}
                    </Text>
                </View>
            </View>

            <AddTransactionPlate
                onAdd={addSpending}
                locale={application.locale}
                scheme={application.colorScheme}
                currency={application.currency}
            />
        </View>
    </Page>


    function addSpending(amount: number) {
        if (!application) {
            throw new Error('Application was not set');
        }

        const date = new Date();
        application.addSpending(application.day, amount, date.getHours(), date.getMinutes());
    }
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    budgetText: {
        color: scheme.secondaryText,
        marginBottom: 10,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: scheme.primaryText
    },
    budgetContainer: {
        marginHorizontal: 36,
        marginBottom: 24
    },
    budget: {
        fontSize: 40,
    },
    budgetAmounts: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    deltaAmount: {
        fontSize: 18,
        paddingBottom: 4
    },
    headerContainer: {
        paddingLeft: 24,
        paddingRight: isSmallScreen ? 12 : 24,
        paddingVertical: isBigScreen ? 72 : 48,
        height: '100%',
    },
    keyboardGroupContainer: {
        position: 'absolute',
        bottom: 0,
    },
});