import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { _daysInMonth } from '../domain/budget';
import { IconButton } from './IconButton';

const Window = Dimensions.get('window')
function DayOfMonthSpendingsList({ spendings, remove }) {
    return <View style={styles.dayOfMonthSpendingsList}>
        {
            spendings.map(s => <DayOfMonthSpending spending={s} key={s.id} remove={() => remove(s.id)} />)
        }
    </View>
}

function DayOfMonthSpending({ spending, remove }) {
    return <View style={styles.dayOfMonthSpending}>
        <Text style={styles.dayOfMonthSpendingText}>{spending.amount} &#8381;</Text>
        <IconButton size={40} innerSize={18} icon='close-circle' color='rgb(255, 69, 58)' onPress={remove} />
    </View>
}

const styles = StyleSheet.create({
    dayOfMonthSpending: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    dayOfMonthSpendingText: {
        fontSize: 22
    },
    dayOfMonthSpendingsList: {
        marginLeft: 30,
        marginRight: 20,
        marginTop: 40,
        marginBottom: 40
    }
})

export default DayOfMonthSpendingsList