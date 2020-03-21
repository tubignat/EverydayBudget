import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';

import SlidingUpPanel from './SlidingUpPanel';
import DayOfMonthSpendingsList from './DayOfMonthSpendingsList';
import { TextButton } from './TextButton';


const Window = Dimensions.get('window')

export function DaysSpendingsPanel({ closePanel, month, day, budget, saldo, spendings, remove, edit, add, locale }) {
    return <SlidingUpPanel onClose={closePanel} offsetTop={Window.height / 4}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.daySpendingHeader}>
                <Text style={styles.daySpendingDateText}>{locale.getDateText(day, month)}</Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>{locale.budget}</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: budget > 0 ? 'black' : 'rgb(255, 69, 58)'
                }}>
                    {budget} &#8381;
                </Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>{locale.saldos}</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: saldo > 0 ? 'black' : 'rgb(255, 69, 58)'
                }}>{saldo} &#8381;</Text>
            </View>
            {
                spendings.length > 0 &&
                <DayOfMonthSpendingsList locale={locale} spendings={spendings} remove={remove} edit={edit} add={() => add(day)} />
            }
            {
                spendings.length === 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>{locale.noSpendingForThisDay}</Text>
                    <TextButton text={locale.add} height={50} fontSize={15} onPress={() => add(day)} />
                </View>
            }
        </ScrollView>
    </SlidingUpPanel>
}

export function TableHeader({ locale }) {
    return <View style={styles.tableHeaderContainer}>
        <Text style={[styles.tableHeaderCell, { width: 65 }]}>{locale.dateColumn}</Text>
        <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>{locale.saldoColumn}</Text>
    </View>
}


export class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { day, month, year, saldo, isToday, locale } = this.props;
        const dayOfWeek = new Date(year, month, day).getDay();
        const style = isToday ? [styles.dayOfMonth, styles.weekend] : styles.dayOfMonth;

        return <TouchableWithoutFeedback style={styles.calendarRow}
            onPress={this.props.onClick}
            onPressIn={() => this.setState({ isPressed: true })}
            onPressOut={() => this.setState({ isPressed: false })}
        >
            <View
                style={[styles.calendarRow,
                { transform: this.state.isPressed ? [{ scaleY: 0.95 }, { scaleX: 0.95 }] : [] },
                { marginBottom: this.isSunday(dayOfWeek) ? 15 : 0 }
                ]}
            >
                <Text style={[styles.tableRowCell, style]}>
                    {day},  {locale.getDayOfWeekAbbr(dayOfWeek)}
                </Text>
                <Text
                    style={[styles.daysBudget, styles.tableRowCell, { color: saldo > 0 ? 'black' : 'rgb(255, 69, 58)' }]}
                >
                    {saldo} &#8381;
                </Text>
            </View>
        </TouchableWithoutFeedback>

    }

    isWeekend = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 0;
    isSunday = (dayOfWeek) => dayOfWeek === 0;

}

const styles = StyleSheet.create({
    dayOfMonth: {
        width: 75
    },
    weekend: {
        color: 'crimson',
    },
    daysBudget: {
        textAlign: 'right'
    },
    calendarRow: {
        marginLeft: 20,
        marginRight: 15,
        padding: 15,
        paddingLeft: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
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
    incomesList: {
        margin: 20,
        marginRight: 0,
        marginBottom: 40,
        flex: 1,
        justifyContent: 'center'
    },
    addButton: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeView: {
        flex: 1,
        paddingBottom: 10,
        flexBasis: 'auto',
        flexDirection: 'row',
    },
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
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeViewText: {
        alignSelf: 'center',
        flex: 1,
        flexGrow: 1.5,
        fontSize: 18,
    },
    incomeViewAmount: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    incomeViewAmountText: {
        fontSize: 18,
    },
    removeButtonContainer: {
        alignSelf: 'center'
    },
    tableHeaderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 15,
        borderBottomWidth: 1,
        borderColor: 'gray',
        padding: 15,
        paddingLeft: 5
    },
    tableHeaderCell: {
        width: 100,
        fontSize: 18,
        color: 'gray'
    },
    tableRowCell: {
        width: 100,
        fontSize: 20,
        paddingLeft: 5,
    },
    daySpendingHeader: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        marginLeft: 20
    },
    daySpendingDateText: {
        fontSize: 30
    },
    daySpendingBudgetContainer: {
        flexDirection: 'row',
        marginLeft: 30,
        marginTop: 10
    },
    daySpendingBudgetText: {
        fontSize: 16
    },
    daySpendingBudgetLabel: {
        fontSize: 16,
        width: 80
    }
});