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
    scheme: ColorScheme, cellSize: number, fontSize: number, year: number, month: number, day: number, chosenDay: number,
    onPress: (day: number) => void
}) {
    const styles = getStyles(props.scheme, props.cellSize, props.fontSize);

    const daysOfMonthArray = getDaysOfMonthArray(props.year, props.month);
    return <View>
        {
            daysOfMonthArray.map(renderArrayRow)
        }
    </View>


    function renderArrayRow(row: number[]) {
        return <View style={styles.row}>
            {
                row.map((day, i) => {

                    const textColor = day === props.day
                        ? props.scheme.danger
                        : i === 5 || i === 6
                            ? props.scheme.secondaryText
                            : props.scheme.primaryText;


                    return <DatePickerDayButton
                        text={day === 0 ? '' : day.toString()}
                        size={props.cellSize}
                        fontSize={props.fontSize}
                        textColor={textColor}
                        backgroundColor={props.scheme.primary}
                        isChosen={day === props.chosenDay}
                        onPress={() => props.onPress(day)}
                    />
                })
            }
        </View>
    }
}

function getDaysOfMonthArray(year: number, month: number) {
    return [
        [0, 0, 1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 30, 0, 0, 0]
    ]
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