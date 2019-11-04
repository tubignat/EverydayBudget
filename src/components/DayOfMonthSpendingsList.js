import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { _daysInMonth } from '../domain/budget';
import { IconButton } from './IconButton';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from './TextButton';

const Window = Dimensions.get('window')
function DayOfMonthSpendingsList({ spendings, remove, edit, add }) {
    return <View style={styles.dayOfMonthSpendingsList}>
        {
            spendings.map(s => <DayOfMonthSpending spending={s} key={s.id} remove={() => remove(s.id)} edit={(amount) => edit(s.id, amount)} />)
        }
        {
            spendings.length !== 0 && <View style={styles.addButton}>
                <TextButton text='Добавить' height={50} fontSize={18} onPress={add} />
            </View>
        }
    </View>
}

function DayOfMonthSpending({ spending, remove, edit }) {
    return <View style={styles.dayOfMonthSpending}>
        <View style={styles.incomeViewAmount}>
            <TextInputWithTemporaryInvalidValue
                style={styles.incomeViewAmountText}
                value={spending.amount.toString()}
                onChange={(text) => edit(Number(text))}
                placeholder=''
                isValidValue={(text) => {
                    const number = Number(text);
                    return !isNaN(number) && number !== 0;
                }}
            />
            <Text style={styles.incomeViewAmountText}> &#8381;</Text>
        </View>
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
        marginBottom: 160
    },

    incomeViewAmount: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    incomeViewAmountText: {
        fontSize: 22,
    },
})

export default DayOfMonthSpendingsList