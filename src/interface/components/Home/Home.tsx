import React, {useState} from 'react';
import {View, Text, Dimensions, StyleSheet, Animated} from 'react-native';
import {Page} from '../common/Page'
import {observer} from 'mobx-react';
import {ApplicationContext} from '../../ApplicationContext';
import {formatMoney} from '../../NumberFormat';
import {ColorScheme} from '../../color/ColorScheme';
import {AddTransactionPlate} from './AddTransactionPlate';
import {Category} from '../../../domain/entities/Category';

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const Home = observer(() => {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [anim] = useState(new Animated.Value(1));

    const styles = getStyles(application.colorScheme, anim);

    const canSpendTodayColor = Math.round(application.todaysDelta) < 0
        ? application.colorScheme.danger
        : application.colorScheme.primaryText;

    const savedThisMonthColor = Math.round(application.savedThisMonth) < 0
        ? application.colorScheme.danger
        : application.colorScheme.primaryText;

    const leftInMonthColor = Math.round(application.leftInMonth) < 0
        ? application.colorScheme.danger
        : application.colorScheme.primaryText;

    return <Page scheme={application.colorScheme}>
        {
            !isSmallScreen && <View style={styles.headerContainer}>
                <Text style={styles.header}>
                    {application.locale.homePageTitle}
                </Text>
            </View>
        }
        <View style={styles.keyboardGroupContainer}>

            <View style={{flexDirection: 'row', marginHorizontal: 36, marginBottom: 36}}>
                <View style={{marginRight: 48}}>
                    <Text style={styles.budgetText}>
                        {application.locale.leftInMonth}
                    </Text>
                    <View style={styles.budgetAmounts}>
                        <Animated.Text style={{ ...styles.statText, color: leftInMonthColor }}>
                            {formatMoney(application.leftInMonth)}&nbsp;
                        </Animated.Text>
                        <Animated.Text style={{...styles.budgetPerDay}}>
                            / {formatMoney(application.monthBudget)} {application.currency}
                        </Animated.Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.budgetText}>
                        {application.locale.savedThisMonth}
                    </Text>
                    <Animated.Text style={{...styles.statText, color: savedThisMonthColor}}>
                        {formatMoney(application.savedThisMonth)} {application.currency}
                    </Animated.Text>
                </View>
            </View>

            <Animated.View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>
                    {application.locale.canSpendToday}
                </Text>
                <View style={styles.budgetAmounts}>
                    <Animated.Text style={{...styles.budget, color: canSpendTodayColor}}>
                        {formatMoney(application.todaysDelta)}&nbsp;
                    </Animated.Text>
                    <Animated.Text style={{...styles.budgetPerDay}}>
                        / {formatMoney(application.budgetPerDay)} {application.currency}
                    </Animated.Text>
                </View>
            </Animated.View>

            <AddTransactionPlate
                onAdd={addSpending}
                locale={application.locale}
                scheme={application.colorScheme}
                currency={application.currency}
                allCategories={application.sortedCategories}
                onExpandAnimationStart={onExpandAnimationStart}
                onShrinkAnimationStart={onShrinkAnimationStart}
            />
        </View>
    </Page>

    function addSpending(amount: number, category: Category | null) {
        if (!application) {
            throw new Error('Application was not set');
        }

        const date = new Date();
        application.addSpending(application.day, amount, date.getHours(), date.getMinutes(), category);
    }

    function onExpandAnimationStart() {
        Animated.spring(anim, {toValue: 0, bounciness: 1, useNativeDriver: false}).start();
    }

    function onShrinkAnimationStart() {
        Animated.timing(anim, {toValue: 1, duration: 300, useNativeDriver: false}).start();
    }
})

const getStyles = (scheme: ColorScheme, anim: Animated.Value): any => {
    return {
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
            marginBottom: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 24]
            }),
        },
        budget: {
            fontSize: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 40]
            }),
            height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [17, 40]
            }),
            fontWeight: '500'
        },
        budgetPerDay: {
            fontSize: 14,
            color: scheme.secondaryText
        },
        budgetAmounts: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        deltaAmount: {
            fontSize: 18,
            paddingBottom: 4,
            transform: [
                {
                    translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [53, 0]
                    })
                }
            ]
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
        statText: {
            fontSize: 18,
            height: 21,
            fontWeight: '500',
            color: scheme.primaryText
        }
    }
}
