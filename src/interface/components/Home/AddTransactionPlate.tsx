import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KeyBoard } from './keyboard/Keyboard';
import { AddSpendingButton } from './keyboard/AddSpendingButton';
import { formatMoney } from '../../NumberFormat';
import { ColorScheme } from '../../color/ColorScheme';
import { Locale } from '../../locale/Locale';
import { Currency } from '../../../domain/repositories/UserPreferencesRepository';

interface IAddTransactionPlateProps {
    scheme: ColorScheme
    locale: Locale
    currency: Currency
    onAdd: (amount: number) => void
}

export function AddTransactionPlate({ scheme, locale, currency, onAdd }: IAddTransactionPlateProps) {
    const styles = getStyles(scheme);

    const [integer, setInteger] = useState(0);
    const [fractions, setFractions] = useState<number[]>([]);
    const [isFractionInputMode, setIsFractionInputMode] = useState(false);

    const disabled = integer === 0 && fractions.length !== 2;

    return <View style={styles.container}>
        <View style={styles.inputContainer}>
            <Text style={styles.addTransactionText}>
                {locale.addExpense}
            </Text>
            <View style={styles.addTransactionInput}>
                <Text style={styles.transaction}>
                    {getFormattedInput()}
                </Text>
                <AddSpendingButton onPress={onAddPressed} disabled={disabled} scheme={scheme} locale={locale} />
            </View>
        </View>

        <KeyBoard onKeyPressed={handleKeyPressed} onRemoveKeyPressed={clearInput} scheme={scheme} locale={locale} />
    </View>

    function getFormattedInput() {
        const integerPart = formatMoney(integer);
        const fractionPart = isFractionInputMode ? `.${fractions.join('')}` : '';

        return `${integerPart}${fractionPart} ${currency}`;
    }

    function handleKeyPressed(char: string) {
        if (char === '.') {
            setIsFractionInputMode(true);

        } else {
            const updatedInteger = isFractionInputMode || integer > 9999
                ? integer
                : Number(integer.toString().concat(char));

            const updatedFractions = !isFractionInputMode || fractions.length === 2 || (fractions[0] === 0 && Number(char) === 0)
                ? fractions
                : fractions.concat(Number(char));

            setInteger(updatedInteger);
            setFractions(updatedFractions);
        }
    };

    function clearInput() {
        setIsFractionInputMode(false);
        setInteger(0);
        setFractions([]);
    };

    function onAddPressed() {
        const fractionNumber = Number(fractions.join(''));
        const amount = integer + (fractionNumber / 100);

        onAdd(amount);
        clearInput();
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        backgroundColor: scheme.keyboardPlateBackground,
        marginBottom: 48,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 16
    },
    inputContainer: {
        paddingTop: 12,
        paddingLeft: 12,
        marginBottom: 16
    },
    addTransactionText: {
        color: scheme.secondaryText,
        marginBottom: 16
    },
    addTransactionInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addTransactionButton: {
        fontSize: 45,
    },
    transaction: {
        fontSize: 32,
        color: scheme.primaryText
    },
});