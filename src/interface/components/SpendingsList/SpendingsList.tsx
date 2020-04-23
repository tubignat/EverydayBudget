import React, { useState } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';
import { IconButton } from '../IconButton';
import { formatMoney } from '../../NumberFormat';
import { Spending, SpendingId } from '../../../domain/repositories/SpendingsRepository';
import { ColorScheme } from '../../color/ColorScheme';
import { Currency } from '../../../domain/repositories/UserPreferencesRepository';
import { observer } from 'mobx-react';
import AmountInput from '../AmountInput';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface ISpendingsListProps {
    spendings: Spending[]
    remove: (id: SpendingId) => void
    edit: (id: SpendingId, amount: number) => void
    scheme: ColorScheme
    currency: Currency
    shouldPlayEnterAnimation: boolean
    onRemoveAnimationStart?: () => void
}

export const SpendingsList = observer((props: ISpendingsListProps) => {

    return <View>
        {
            props.spendings.map(s =>
                <SpendingView
                    key={s.id}
                    spending={s}
                    onRemovePressed={() => props.remove(s.id)}
                    onEdit={amount => props.edit(s.id, amount)}
                    shouldPlayEnterAnimation={props.shouldPlayEnterAnimation}
                    {...props}
                />
            )
        }
    </View>
});

interface ISpendingView {
    spending: Spending
    onRemovePressed: () => void
    onEdit: (amount: number) => void
    scheme: ColorScheme
    currency: Currency
    shouldPlayEnterAnimation: boolean
    onRemoveAnimationStart?: () => void
}

function SpendingView(props: ISpendingView) {

    const [scale] = useState(getScaleAnimatedValue())

    const height = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 95]
    })

    const marginBottom = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, isSmallScreen ? 12 : 16]
    })

    const opacity = scale.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, 0, 1]
    })

    const styles = getStyles(props.scheme)

    return <Animated.View style={{ height: height, marginBottom: marginBottom, opacity: opacity }}>

        <Animated.View style={{ ...styles.spendingView, transform: [{ scale: scale }] }}>

            <View style={styles.leftCell}>
                <View style={styles.amount}>
                    <AmountInput
                        color={props.scheme.primaryText}
                        value={props.spending.amount}
                        maxValue={999999}
                        onChange={props.onEdit}
                        placeholder=''
                        currency={props.currency}
                        fontSize={isSmallScreen ? 24 : 30}
                        height={36}
                    />
                </View>
                <Text style={styles.time}>{getTimeString()}</Text>
            </View>

            <View style={styles.rightCell}>
                <View style={{ width: 40 }}>
                    <IconButton
                        size={40}
                        innerSize={20}
                        icon={'close-circle'}
                        color={props.scheme.danger}
                        onPress={onRemovePressedWrapper}
                        disabled={false}
                    />
                </View>
                <View style={styles.categoryContainer}>
                    <View style={{ ...styles.categoryColor, backgroundColor: '#AAAAAA' }} />
                    <Text style={styles.categoryText} numberOfLines={1}>Без категории</Text>
                </View>
            </View>
        </Animated.View>
    </Animated.View>

    function getTimeString() {
        if (props.spending.hour === undefined
            || props.spending.hour === null
            || props.spending.minute === undefined
            || props.spending.minute === null
        ) {
            return ''
        }

        const hourString = props.spending.hour.toString().padStart(2, '0')
        const minuteString = props.spending.minute.toString().padStart(2, '0')

        return `${hourString}:${minuteString}`;
    }

    function onRemovePressedWrapper() {
        props.onRemoveAnimationStart && props.onRemoveAnimationStart();
        Animated.timing(scale, { toValue: 0, duration: 200 }).start(props.onRemovePressed);
    }

    function getScaleAnimatedValue() {
        if (!props.shouldPlayEnterAnimation) {
            return new Animated.Value(1);
        }

        const value = new Animated.Value(0);
        Animated.spring(value, { toValue: 1 }).start();

        return value;
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    spendingView: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: scheme.plateBackground,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftCell: {
        paddingLeft: 20,
        paddingVertical: 18,
        flexGrow: 1,
        flexShrink: 1,
        alignItems: 'flex-start',
        width: '50%',
    },
    rightCell: {
        padding: 10,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '50%',
        flexGrow: 1,
        flexShrink: 1
    },
    amount: {
        marginBottom: 8,
    },
    time: {
        fontSize: 16,
        color: scheme.secondaryText
    },
    categoryContainer: {
        paddingBottom: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    categoryColor: {
        width: 8,
        height: 8,
        borderRadius: 8,
        marginRight: 8,
        marginTop: 2
    },
    categoryText: {
        fontSize: isSmallScreen ? 12 : 16,
        color: scheme.secondaryText
    }
});