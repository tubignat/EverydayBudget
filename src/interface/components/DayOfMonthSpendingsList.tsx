import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, TextInput } from 'react-native';
import { IconButton } from './IconButton';
import AmountInput from './TextInputWithTemporaryInvalidValue';
import { TextButton } from './TextButton';
import { ApplicationContext } from '../ApplicationContext';
import { Spending, SpendingId } from '../../domain/repositories/SpendingsRepository';
import { ColorScheme } from '../color/ColorScheme';

interface IDayOfMonthSpendingsListProps {
    spendings: Spending[]
    remove: (id: SpendingId) => void
    edit: (id: SpendingId, amount: number) => void
    add: () => void
}

function DayOfMonthSpendingsList({ spendings, remove, edit, add }: IDayOfMonthSpendingsListProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <View style={styles.dayOfMonthSpendingsList}>
        {
            spendings.map(s => <DayOfMonthSpending spending={s} key={s.id} remove={() => remove(s.id)} edit={(amount) => edit(s.id, amount)} />)
        }
        {
            spendings.length !== 0 && <View style={styles.addButton}>
                <TextButton text={application.locale.add} height={50} fontSize={18} onPress={add} disabled={false} scheme={application.colorScheme} />
            </View>
        }
    </View>
}

interface IDayOfMonthSpendingProps {
    spending: Spending
    remove: () => void
    edit: (amount: number) => void
}

function DayOfMonthSpending({ spending, remove, edit }: IDayOfMonthSpendingProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    const [expandAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));

    let textInputRef: TextInput;

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
                <AmountInput
                    forwardedRef={(ref: TextInput) => textInputRef = ref}
                    style={styles.incomeViewAmountText}
                    value={spending.amount}
                    onChange={(amount: number) => edit(amount)}
                    placeholder=''
                />
                <Text style={styles.incomeViewAmountText}> {application.currency}</Text>
            </View>
        </TouchableWithoutFeedback>
        <IconButton size={40} innerSize={18} icon='close-circle' color={application.colorScheme.danger} onPress={onRemove} disabled={false} />
    </Animated.View>


    function onRemove() {
        Animated.parallel([
            Animated.timing(expandAnim, { toValue: 0, duration: 200 }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 150 }),
        ])
            .start(remove)
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    addButton: {
        width: 110
    },
    dayOfMonthSpending: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        fontSize: 22,
        color: scheme.primaryText
    },
})

export default DayOfMonthSpendingsList