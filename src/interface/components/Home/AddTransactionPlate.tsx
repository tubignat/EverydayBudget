import React, {useState} from 'react';
import {View, Text, StyleSheet, Animated, ScrollView} from 'react-native';
import {KeyBoard} from './keyboard/Keyboard';
import {AddSpendingButton} from './keyboard/AddSpendingButton';
import {formatMoney} from '../../NumberFormat';
import {ColorScheme} from '../../color/ColorScheme';
import {Locale} from '../../locale/Locale';
import {Currency} from '../../../domain/repositories/UserPreferencesRepository';
import {CategoryScrollingPicker} from './CategoryScrollingPicker';
import {Category} from '../../../domain/entities/Category';

interface IAddTransactionPlateProps {
    scheme: ColorScheme
    locale: Locale
    allCategories: (Category | null)[]
    currency: Currency
    onAdd: (amount: number, category: Category | null) => void
    onExpandAnimationStart: () => void
    onShrinkAnimationStart: () => void
}

export function AddTransactionPlate(props: IAddTransactionPlateProps) {
    const {scheme, locale, currency, allCategories, onAdd, onExpandAnimationStart, onShrinkAnimationStart} = props;
    const styles = getStyles(scheme);

    const [integer, setInteger] = useState(0);
    const [fractions, setFractions] = useState<number[]>([]);
    const [isFractionInputMode, setIsFractionInputMode] = useState(false);

    const [category, setCategory] = useState<Category | null>(props.allCategories[0]);

    const [scrollRef, setScrollRef] = useState<ScrollView | null>(null);

    const disabled = integer === 0 && fractions.length !== 2;

    const [anim] = useState(new Animated.Value(0));
    const height = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 65]
    })
    const opacity = anim.interpolate({
        inputRange: [0, .2, 1],
        outputRange: [0, 0, 1]
    })

    return <View style={styles.container}>
        <View style={styles.inputContainer}>
            <Text style={styles.addTransactionText}>
                {locale.addExpense}
            </Text>
            <View style={styles.addTransactionInput}>
                <Text style={styles.transaction}>
                    {getFormattedInput()}
                </Text>
                <AddSpendingButton onPress={onAddPressed} disabled={disabled} scheme={scheme} locale={locale}/>
            </View>
        </View>

        <Animated.View style={{position: 'relative', height: height, opacity: opacity}}>
            <View style={{position: 'absolute', top: 0}}>
                <CategoryScrollingPicker
                    allCategories={allCategories}
                    scheme={scheme}
                    chosenCategory={category}
                    onCategoryChosen={setCategory}
                    locale={locale}
                    setScrollRef={setScrollRef}
                />
            </View>
        </Animated.View>

        <KeyBoard onKeyPressed={handleKeyPressed} onRemoveKeyPressed={clearInput} scheme={scheme} locale={locale}/>
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

            if (disabled && (updatedInteger !== 0 || updatedFractions.length === 2)) {
                onExpandAnimationStart();
                Animated.spring(anim, {toValue: 1, bounciness: 1, useNativeDriver: false}).start();
            }

            setInteger(updatedInteger);
            setFractions(updatedFractions);
        }
    }

    function clearInput() {
        onShrinkAnimationStart();
        Animated
            .timing(anim, {toValue: 0, duration: 300, useNativeDriver: false})
            .start(() => scrollRef?.scrollTo({x: 0, animated: false}));

        setIsFractionInputMode(false);
        setInteger(0);
        setFractions([]);
        setCategory(props.allCategories[0]);
    };

    function onAddPressed() {
        const fractionNumber = Number(fractions.join(''));
        const amount = integer + (fractionNumber / 100);

        onAdd(amount, category);
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
