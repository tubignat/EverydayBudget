import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import { observer } from 'mobx-react';
import { _daysInMonth, getSaldo, getSaldosForMonth } from '../domain/budget';
import { getBudgetPerDay, getBudget } from "../domain/budget";
import Picker from '../components/Picker'
import { TextButton } from '../components/TextButton'
import SlidingUpPanel from '../components/SlidingUpPanel';

const Window = Dimensions.get('window')
import Page from '../components/Page'
import DayOfMonthSpendingsList from '../components/DayOfMonthSpendingsList';
import { resume } from '../../node_modules/expo/build/AR';

@observer
export default class MonthSpendings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isForMonth: true,
            isModalOpen: false,
        };
    }

    render() {
        const { spendingsStorage, incomesStorage, expensesStorage } = this.props;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const daysInMonth = _daysInMonth(month, year);
        const budgetPerDay = getBudgetPerDay(
            incomesStorage.getIncomes(year, month).map(i => i.amount),
            expensesStorage.getExpenses(year, month).map(e => e.amount),
            year,
            month
        );

        const days = Array.from({ length: daysInMonth }, (_, k) => k + 1);
        const monthName = this.getMonthName(month);

        const saldos = getSaldosForMonth(budgetPerDay, spendingsStorage.allSpendings, year, month, daysInMonth);

        return <View>
            {
                this.state.isModalOpen &&
                <DaysSpendingsPanel closePanel={this.closeModal}
                    day={this.state.openedDay}
                    month={month}
                    year={year}
                    budget={getBudget(budgetPerDay, spendingsStorage.getSpendings, year, month, this.state.openedDay).toFixed(0)}
                    saldo={saldos[this.state.openedDay - 1].toFixed(0)}
                    spendings={spendingsStorage.getSpendings(year, month, this.state.openedDay)}
                    remove={(id) => spendingsStorage.removeSpending(id)}
                    edit={(id, amount) => spendingsStorage.editSpending(id, amount, null)}
                    add={(day) => spendingsStorage.addSpending(year, month, day, 0, null)}
                />
            }
            <Page>
                <KeyboardAvoidingView behavior='padding'>
                    <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                        <View style={{ paddingBottom: 120 }}>
                            <Text style={styles.header}>Статистика</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 230 }}>
                                {/* <Picker text={monthName} disabled={!this.state.isForMonth} width={110}
                                    onPress={() => this.setState({ isForMonth: true })} />
                                <Picker text='Весь год' disabled={this.state.isForMonth} width={110}
                                        onPress={() => this.setState({isForMonth: false})}/> */}
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <TableHeader />
                                {
                                    days.map(d => <TableRow
                                        key={d}
                                        day={d}
                                        month={month}
                                        year={year}
                                        saldo={saldos[d - 1].toFixed(0)}
                                        onClick={() => this.openModal(d)}
                                        isToday={d === day}
                                    />)
                                }
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Page>
        </View>
    }

    openModal = (day) => {
        this.setState({ isModalOpen: true, openedDay: day });
        this.props.onModalOpen();
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.props.onModalClose();
    }

    getMonthName = (month) => {
        switch (month) {
            case 0:
                return 'Январь';
            case 1:
                return 'Февраль';
            case 2:
                return 'Март';
            case 3:
                return 'Апрель';
            case 4:
                return 'Май';
            case 5:
                return 'Июнь';
            case 6:
                return 'Июль';
            case 7:
                return 'Август';
            case 8:
                return 'Сентябрь';
            case 9:
                return 'Октябрь';
            case 10:
                return 'Ноябрь';
            case 11:
                return 'Декабрь';
        }
    }
}

function DaysSpendingsPanel({ closePanel, year, month, day, budget, saldo, spendings, remove, edit, add }) {
    const dayOfWeek = new Date(year, month, day).getDay();
    const monthName = getMonthName(month);
    const dayOfWeekName = getDayOfWeekName(dayOfWeek);

    return <SlidingUpPanel onClose={closePanel} offsetTop={Window.height / 4}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.daySpendingHeader}>
                <Text style={styles.daySpendingDateText}>{day} {monthName}</Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>Бюджет</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: budget > 0 ? 'black' : 'rgb(255, 69, 58)'
                }}>
                    {budget} &#8381;
                </Text>
            </View>
            <View style={styles.daySpendingBudgetContainer}>
                <Text style={styles.daySpendingBudgetLabel}>Остаток</Text>
                <Text style={{
                    ...styles.daySpendingBudgetText,
                    color: saldo > 0 ? 'black' : 'rgb(255, 69, 58)'
                }}>{saldo} &#8381;</Text>
            </View>
            {
                spendings.length > 0 &&
                <DayOfMonthSpendingsList spendings={spendings} remove={remove} edit={edit} add={() => add(day)} />
            }
            {
                spendings.length === 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>За этот день трат нет. </Text>
                    <TextButton text='Добавить' height={50} fontSize={15} onPress={() => add(day)} />
                </View>
            }
        </ScrollView>
    </SlidingUpPanel>

    function getDayOfWeekName(dayOfWeek) {
        switch (dayOfWeek) {
            case 0:
                return 'воскресенье';
            case 1:
                return 'понедельник';
            case 2:
                return 'вторник';
            case 3:
                return 'среда';
            case 4:
                return 'четверг';
            case 5:
                return 'пятница';
            case 6:
                return 'суббота';
        }
    }

    function getMonthName(month) {
        switch (month) {
            case 0:
                return 'января';
            case 1:
                return 'февраля';
            case 2:
                return 'марта';
            case 3:
                return 'апреля';
            case 4:
                return 'мая';
            case 5:
                return 'июня';
            case 6:
                return 'июля';
            case 7:
                return 'августа';
            case 8:
                return 'сентября';
            case 9:
                return 'октября';
            case 10:
                return 'ноября';
            case 11:
                return 'декабря';
        }
    }
}

function TableHeader() {
    return <View style={styles.tableHeaderContainer}>
        <Text style={[styles.tableHeaderCell, { width: 65 }]}>День</Text>
        <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Остаток</Text>
    </View>
}


class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { day, month, year, saldo, isToday } = this.props;
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
                    {day}, {this.getDayOfWeekAbbreviation(dayOfWeek)}
                </Text>
                <Text
                    style={[styles.daysBudget, styles.tableRowCell, { color: saldo > 0 ? 'black' : 'rgb(255, 69, 58)' }]}
                >
                    {saldo} &#8381;
                </Text>
            </View>
        </TouchableWithoutFeedback>

    }

    getDayOfWeekAbbreviation = (datOfWeek) => {
        switch (datOfWeek) {
            case 0:
                return 'вс';
            case 1:
                return 'пн';
            case 2:
                return 'вт';
            case 3:
                return 'ср';
            case 4:
                return 'чт';
            case 5:
                return 'пт';
            case 6:
                return 'сб';
        }
    }

    isWeekend = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 0;
    isSunday = (dayOfWeek) => dayOfWeek === 0;

}

const styles = StyleSheet.create({
    dayOfMonth: {
        width: 65
        // fontSize: 20,
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