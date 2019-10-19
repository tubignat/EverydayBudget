import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { observer } from 'mobx-react';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from '../components/TextButton';
import { _daysInMonth } from '../domain/budget';
import { getBudgetPerDay, getBudget } from "../domain/budget";
import Picker from '../components/Picker'
import SlidingUpPanel from '../components/SlidingUpPanel';
const Window = Dimensions.get('window')

@observer
export default class MonthSpendings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isForMonth: true,
            isModalOpen: false
        };
    }

    getBudgetForTheDay = (day, month, year) => {
        const { incomesStorage, expensesStorage, spendingsStorage } = this.props;
        const budgetPerDay = getBudgetPerDay(
            incomesStorage.getIncomes(year, month).map(i => i.amount),
            expensesStorage.getExpenses(year, month).map(e => e.amount),
            year,
            month
        );

        return getBudget(budgetPerDay, spendingsStorage.getSpendings, year, month, day);
    }

    render() {
        const { incomesStorage, expensesStorage, spendingsStorage } = this.props;
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const daysInMonth = _daysInMonth(month, year);


        const incomes = incomesStorage.getIncomes(year, month);
        const expenses = expensesStorage.getExpenses(year, month);

        const days = Array.from({ length: daysInMonth }, (_, k) => k + 1);

        return <KeyboardAvoidingView behavior='padding'>
            {
                this.state.isModalOpen && <SlidingUpPanel onClose={this.closeModal} offsetTop={Window.height / 2 - 50} />
            }
            <ScrollView style={{ marginTop: 25, padding: 20 }}>
                <Text style={styles.header} onPress={this.openModal}>Статистика</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 230 }}>
                    <Picker text='Октябрь' disabled={!this.state.isForMonth} width={110} onPress={() => this.setState({ isForMonth: true })} />
                    <Picker text='Весь год' disabled={this.state.isForMonth} width={110} onPress={() => this.setState({ isForMonth: false })} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <TableHeader />

                    {
                        days.map(d => <TableRow
                            key={d}
                            day={d}
                            month={month}
                            year={year}
                            budget={this.getBudgetForTheDay(d, month, year).toFixed(0)}
                        />)
                    }
                </View>

                <View style={{ height: 60 }}></View>

            </ScrollView>
        </KeyboardAvoidingView>
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
        this.props.onModalOpen();
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.props.onModalClose();
    }
}

function TableHeader() {
    return <View style={styles.tableHeaderContainer}>
        <Text style={[styles.tableHeaderCell, { width: 65 }]}>День</Text>
        <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Бюджет</Text>
    </View>
}


class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { day, month, year, budget, saldo } = this.props;
        const dayOfWeek = new Date(year, month, day).getDay();
        const style = this.isWeekend(dayOfWeek) ? [styles.dayOfMonth, styles.weekend] : styles.dayOfMonth;

        return <View style={styles.calendarRow}>
            <Text style={[styles.tableRowCell, style]}>
                {day}, {this.getDayOfWeekAbbreviation(dayOfWeek)}
            </Text>
            <Text style={[styles.daysBudget, styles.tableRowCell]} >
                {budget} &#8381;
            </Text>
        </View>
    }

    getDayOfWeekAbbreviation = (datOfWeek) => {
        switch (datOfWeek) {
            case 0: return 'вс';
            case 1: return 'пн';
            case 2: return 'вт';
            case 3: return 'ср';
            case 4: return 'чт';
            case 5: return 'пт';
            case 6: return 'сб';
        }
    }

    isWeekend = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 0;

}

const styles = StyleSheet.create({
    dayOfMonth: {
        width: 65
        // fontSize: 20,
    },
    weekend: {
        color: 'crimson'
    },
    daysBudget: {
        textAlign: 'right'
    },
    calendarRow: {
        marginLeft: 20,
        marginRight: 20,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        marginRight: 20,
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
    }
});