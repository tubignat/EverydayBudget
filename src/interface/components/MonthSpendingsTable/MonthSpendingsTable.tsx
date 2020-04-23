import React, { Component, useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';

import { ApplicationContext } from '../../ApplicationContext';
import { formatMoney } from '../../NumberFormat';
import { ColorScheme } from '../../color/ColorScheme';
import { ApplicationState } from '../../ApplicationState';
import { DaysSpendingsPanel } from '../DaySpendingsPanel';
import { ModalStackState } from '../../ModalStackState';
import { observer } from 'mobx-react';

export const MonthSpendingsTable = observer(() => {

    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const { daysInMonth, startOfPeriod, month, year, saldos, day } = application;

    const days = Array.from({ length: daysInMonth - startOfPeriod + 1 }, (_, k) => k + 1 + startOfPeriod - 1);

    return <View>
        <TableHeader />
        {
            days.map(d => <TableRow
                key={d}
                day={d}
                month={month}
                year={year}
                saldo={saldos[d - 1]}
                onClick={() => onClick(d)}
                isToday={d === day}
            />)
        }
    </View>

    function onClick(day: number) {
        ModalStackState.open((id, onClose) => renderPanel(id, onClose, day));
    }

    function renderPanel(id: number, onClose: () => void, openedDay: number) {
        return <DaysSpendingsPanel key={id} onClose={onClose} openedDay={openedDay} />
    }
});

export function TableHeader() {
    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <View style={styles.tableHeaderContainer}>
        <Text style={[styles.tableHeaderCell, { width: 65 }]}>{application.locale.dateColumn}</Text>
        <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>{application.locale.saldoColumn}</Text>
    </View>
}

interface ITableRowProps {
    day: number
    month: number
    year: number
    saldo: number
    isToday: boolean
    onClick: () => void
}

interface ITableRowState {
    isPressed: boolean
}

export class TableRow extends Component<ITableRowProps, ITableRowState> {

    static contextType = ApplicationContext;

    context !: ApplicationState;

    constructor(props: ITableRowProps) {
        super(props);
        this.state = {
            isPressed: false
        };
    }

    render() {
        const { day, month, year, saldo, isToday, onClick } = this.props;
        const { locale, currency, colorScheme } = this.context;

        const styles = getStyles(colorScheme);

        const dayOfWeek = new Date(year, month, day).getDay();
        const style = isToday ? [styles.dayOfMonth, styles.weekend] : styles.dayOfMonth;


        return <TouchableWithoutFeedback style={styles.calendarRow}
            onPress={onClick}
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
                    style={[styles.daysBudget, styles.tableRowCell, { color: saldo > 0 ? colorScheme.primaryText : colorScheme.danger }]}
                >
                    {formatMoney(saldo)} {currency}
                </Text>
            </View>
        </TouchableWithoutFeedback>

    }

    isWeekend = (dayOfWeek: number) => dayOfWeek === 6 || dayOfWeek === 0;
    isSunday = (dayOfWeek: number) => dayOfWeek === 0;
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    dayOfMonth: {
        width: 75,
        color: scheme.primaryText
    },
    weekend: {
        color: scheme.danger,
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
});