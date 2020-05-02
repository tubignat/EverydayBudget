import React, { useState, useEffect } from 'react';
import { Animated, View, Text, Dimensions, TextInput, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { IconButton } from '../IconButton';
import { Spending } from '../../../../domain/entities/Spending';
import { ColorScheme } from '../../../color/ColorScheme';
import { Currency } from '../../../../domain/repositories/UserPreferencesRepository';
import AmountInput from '../AmountInput';
import { Locale } from '../../../locale/Locale';
import { CategoryPickerModal } from './CategoryPickerModal';
import { ModalStackState } from '../../../ModalStackState';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface ISpendingView {
    spending: Spending
    onRemovePressed: () => void
    onAmountEdit: (amount: number) => void
    scheme: ColorScheme
    locale: Locale
    currency: Currency
    shouldPlayEnterAnimation: boolean
    shouldFocusAddedSpending: boolean
    onRemoveAnimationStart?: () => void
}

export function SpendingView(props: ISpendingView) {

    const [scale] = useState(props.shouldPlayEnterAnimation ? new Animated.Value(0) : new Animated.Value(1));

    const [amountInputRef, setAmountInputRef] = useState<TextInput | null>(null);
    useEffect(open, [amountInputRef]);

    const styles = getStyles(props.scheme, scale);
    const categoryName = props.spending.category?.name ?? props.locale.noCategory;
    const categoryColor = props.spending.category?.color.color ?? props.scheme.inactive;

    return <Animated.View style={styles.spendingViewContainer}>

        <Animated.View style={styles.spendingView}>

            <View style={styles.leftCell}>
                <View style={styles.amount}>
                    <AmountInput
                        color={props.scheme.primaryText}
                        value={props.spending.amount}
                        maxValue={999999}
                        onChange={props.onAmountEdit}
                        placeholder=''
                        currency={props.currency}
                        fontSize={isSmallScreen ? 24 : 30}
                        height={36}
                        setRef={ref => setAmountInputRef(ref)}
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
                <TouchableWithoutFeedback onPress={openCategoryPickerModal}>
                    <View style={styles.categoryContainer}>
                        <View style={{ ...styles.categoryColor, backgroundColor: categoryColor }} />
                        <Text style={styles.categoryText} numberOfLines={1}>
                            {categoryName}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Animated.View>
    </Animated.View >

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

    function open() {
        Animated
            .spring(scale, { toValue: 1, restDisplacementThreshold: .01, restSpeedThreshold: .01 })
            .start(() => { }
                // props.shouldFocusAddedSpending && amountInputRef?.focus()
            );
    }

    function openCategoryPickerModal(event: GestureResponderEvent) {
        const x = event.nativeEvent.pageX;
        const y = event.nativeEvent.pageY;
        ModalStackState.open(onClose =>
            <CategoryPickerModal
                key='categoryPickerModal'
                onClose={onClose}
                expansionPoint={{ x: x, y: y }}
                spending={props.spending}
            />
        );
    }
}

const getStyles = (scheme: ColorScheme, scale: Animated.Value): any => {
    const height = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 95]
    })

    const marginBottom = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, isSmallScreen ? 12 : 16]
    })

    const opacity = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    return {
        spendingViewContainer: {
            height: height,
            marginBottom: marginBottom,
            opacity: opacity
        },
        spendingView: {
            width: '100%',
            borderRadius: 16,
            backgroundColor: scheme.plateBackground,
            flexDirection: 'row',
            justifyContent: 'space-between',
            transform: [
                { scale: scale }
            ]
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

    }
}