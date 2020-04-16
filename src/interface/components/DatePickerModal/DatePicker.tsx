import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';
import { Locale } from '../../locale/Locale';
import { DatePickerDayButton } from './DatePickerDayButton';

interface IDatePickerProps {
    year: number
    month: number
    day: number
    chosenDay: number
    until: number
    cellSize: number
    fontSize: number
    scheme: ColorScheme
    locale: Locale
    onPress: (day: number) => void
}

export function DatePicker(props: IDatePickerProps) {
    return <View>
        <DatePickerHeader {...props} />
        <DatePickerDaysOfMonth {...props} />
    </View>
}

function DatePickerHeader(props: { scheme: ColorScheme, cellSize: number, fontSize: number, locale: Locale }) {
    const styles = getStyles(props.scheme, props.cellSize, props.fontSize);
    return <View style={{
        ...styles.row,
        borderBottomWidth: 1,
        borderBottomColor: props.scheme.inactive,
        marginBottom: 16
    }}>
        {
            [...props.locale.daysOfWeek].map((d, i) => {

                const cellTextStyle = i === 5 || i === 6
                    ? { ...styles.datePickerHeaderText, ...styles.weekend }
                    : { ...styles.datePickerHeaderText, ...styles.workday };

                return <View style={styles.cell} key={i}>
                    <Text style={cellTextStyle}>
                        {d}
                    </Text>
                </View>
            })
        }
    </View>
}

function DatePickerDaysOfMonth(props: {
    scheme: ColorScheme, cellSize: number, fontSize: number, year: number, month: number, day: number, chosenDay: number, until: number,
    onPress: (day: number) => void
}) {
    const styles = getStyles(props.scheme, props.cellSize, props.fontSize);

    const daysOfMonthArray = getDaysOfMonthArray(props.year, props.month).filter(row => row[0] <= props.until);
    return <View>
        {
            daysOfMonthArray.map((row: number[], i: number) => renderArrayRow(i, row))
        }
    </View>


    function renderArrayRow(key: number, row: number[]) {
        return <View style={styles.row} key={key}>
            {
                row.map((day, i) => {

                    const textColor = day === props.day
                        ? props.scheme.danger
                        : i === 5 || i === 6
                            ? props.scheme.secondaryText
                            : props.scheme.primaryText;


                    return <DatePickerDayButton
                        key={i}
                        text={day === 0 ? '' : day.toString()}
                        size={props.cellSize}
                        fontSize={props.fontSize}
                        textColor={day > props.until ? props.scheme.barelyVisible : textColor}
                        backgroundColor={props.scheme.primary}
                        isChosen={day === props.chosenDay}
                        onPress={() => props.onPress(day)}
                        disabled={day === 0 || day > props.until}
                    />
                })
            }
        </View>
    }
}

function getDaysOfMonthArray(year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    let result = Array.from({ length: daysInMonth }, (_, k) => k + 1)

    result = Array.from({ length: firstDayOfWeek - 1 }, _ => 0).concat(result);

    const len = 7 - result.length % 7;
    result = result.concat(Array.from({ length: len === 7 ? 0 : len }, _ => 0))

    const daysOfMonthArray: number[][] = [];

    for (let i = 0; i < result.length / 7; i++) {
        daysOfMonthArray.push(result.slice(i * 7, i * 7 + 7))
    }

    return daysOfMonthArray;
}

const getStyles = (scheme: ColorScheme, cellSize: number, fontSize: number) => StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8
    },
    cell: {
        height: cellSize,
        width: cellSize,
        alignItems: 'center',
        justifyContent: 'center'
    },
    datePickerHeaderText: {
        fontSize: 12,
    },
    dateText: {
        fontSize: fontSize
    },
    today: {
        color: scheme.danger
    },
    chosenText: {
        color: 'white'
    },
    chosenCell: {
        borderRadius: 50,
        backgroundColor: scheme.primary
    },
    weekend: {
        color: scheme.secondaryText
    },
    workday: {
        color: scheme.primaryText
    }
})