import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import { ColorScheme } from '../../../../color/ColorScheme';
import { CategoryColor } from '../../../../../domain/entities/CategoryColor';

interface IColorPickerProps {
    allColors: CategoryColor[]
    chosenColor: CategoryColor
    scheme: ColorScheme
    onColorClick: (color: CategoryColor) => void
}

export function ColorPicker(props: IColorPickerProps) {
    const styles = getColorPickerStyles(props.scheme);

    return <View style={styles.plate}>
        <View style={styles.colorsTable}>
            {
                props.allColors.map(color =>
                    <Color
                        key={color.id}
                        color={color}
                        isChosen={props.chosenColor.id === color.id}
                        onClick={() => props.onColorClick(color)}
                    />
                )
            }
        </View>
    </View>
}

const getColorPickerStyles = (scheme: ColorScheme) => StyleSheet.create({
    plate: {
        borderRadius: 16,
        backgroundColor: scheme.plateBackground,
        marginTop: 8,
    },
    colorsTable: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    }
})

interface IColorProps {
    color: CategoryColor
    isChosen: boolean
    onClick: () => void
}

function Color(props: IColorProps) {

    const [previousIsChosen, setPreviousIsChosen] = useState(props.isChosen);
    const [scale] = useState(props.isChosen ? new Animated.Value(1) : new Animated.Value(0));

    if (previousIsChosen && !props.isChosen) {
        Animated.timing(scale, { toValue: 0, duration: 100, useNativeDriver: false }).start();
        setPreviousIsChosen(false);
    }

    if (!previousIsChosen && props.isChosen) {
        Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: false }).start();
        setPreviousIsChosen(true);
    }

    const styles = getColorStyles(props.color.color, scale);
    return <TouchableOpacity onPress={props.onClick} style={styles.container} activeOpacity={.6} >
        <Animated.View style={styles.colorRing}>
            <View style={styles.color} />
        </Animated.View>
    </TouchableOpacity>
}

const getColorStyles = (color: string, scale: Animated.Value) => {
    const center: 'center' = 'center';

    return {
        container: {
            width: '20%',
            justifyContent: center,
            alignItems: center,
            paddingVertical: 6
        },
        colorRing: {
            width: 32,
            height: 32,
            borderRadius: 16,
            borderColor: color,
            alignItems: center,
            justifyContent: center,
            borderWidth: scale.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2]
            })
        },
        color: {
            backgroundColor: color,
            width: 24,
            height: 24,
            borderRadius: 12
        },
    }
}
