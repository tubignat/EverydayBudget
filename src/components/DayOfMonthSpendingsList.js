import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { IconButton } from './IconButton';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from './TextButton';

function DayOfMonthSpendingsList({ spendings, remove, edit, add, locale }) {
    return <View style={styles.dayOfMonthSpendingsList}>
        {
            spendings.map(s => <DayOfMonthSpending spending={s} key={s.id} remove={() => remove(s.id)} edit={(amount) => edit(s.id, amount)} />)
        }
        {
            spendings.length !== 0 && <View style={styles.addButton}>
                <TextButton text={locale.add} height={50} fontSize={18} onPress={add} />
            </View>
        }
    </View>
}

function DayOfMonthSpending({ spending, remove, edit }) {

    const [expandAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));

    let textInputRef;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 150 }),
            Animated.timing(expandAnim, { toValue: 50, duration: 150 })
        ])
            .start();
    }, [])

    return <Animated.View style={{
        ...styles.dayOfMonthSpending,
        height: expandAnim,
        opacity: fadeAnim
    }}>
        <TouchableWithoutFeedback onPress={() => textInputRef.focus()} >
            <View style={styles.incomeViewAmount}>
                <TextInputWithTemporaryInvalidValue
                    forwardedRef={ref => textInputRef = ref}
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
        </TouchableWithoutFeedback>
        <IconButton size={40} innerSize={18} icon='close-circle' color='rgb(255, 69, 58)' onPress={onRemove} />
    </Animated.View>


    function onRemove() {
        Animated.parallel([
            Animated.timing(expandAnim, { toValue: 0, duration: 200 }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 150 }),
        ])
            .start(remove)
    }
}

const styles = StyleSheet.create({
    addButton: {
        width: 110
    },
    dayOfMonthSpending: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        alignItems: 'center',
        height: '100%'
    },
    incomeViewAmountText: {
        fontSize: 22
    },
})

export default DayOfMonthSpendingsList