import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function SortButton({ onPress, checked }: { onPress: () => void, checked: boolean }) {
    const pressedScale = 0.7;
    const uncheckedScale = 0.8;
    const checkedScale = 1;

    let onPressedAnimationOver: (() => void) | null = null;
    let isPressedAnimationInProgress = false;

    const [scale] = React.useState(new Animated.Value(checked ? checkedScale : uncheckedScale));

    const onRelease = () => {
        const toValue = checked ? uncheckedScale : checkedScale;
        if (isPressedAnimationInProgress) {
            onPressedAnimationOver = () => {
                onPress();
                Animated.timing(scale, { toValue: toValue, duration: 150 }).start();
                onPressedAnimationOver = null;
            }
        } else {
            onPress();
            Animated.timing(scale, { toValue: toValue, duration: 150 }).start();
        }
    }

    const onGrant = () => {
        isPressedAnimationInProgress = true;
        Animated
            .timing(scale, { toValue: pressedScale, duration: 80 })
            .start(() => {
                isPressedAnimationInProgress = false;
                onPressedAnimationOver && onPressedAnimationOver()
            })
    }

    const onTerminate = () => {
        const toValue = checked ? checkedScale : uncheckedScale;
        Animated.timing(scale, { toValue: toValue, duration: 100 }).start()
    }

    return <View
        onStartShouldSetResponder={() => true}
        onResponderGrant={onGrant}
        onResponderRelease={onRelease}
        onResponderTerminate={onTerminate}
    >
        {
            render()
        }
    </View>

    function getSortButtonStyle(scale: Animated.Value) {
        return {
            ...styles.sortButton,
            height: Animated.multiply(35, scale),
            width: Animated.multiply(55, scale),
        }
    }

    function getTextStyle(scale: Animated.Value) {
        return {
            ...styles.text,
            fontSize: scale.interpolate({
                inputRange: [pressedScale, uncheckedScale, checkedScale],
                outputRange: [10, 13, 13]
            })
        }
    }

    function render() {
        let style = getSortButtonStyle(scale);
        checked && (style = { ...style, ...styles.checked });

        let textStyle = getTextStyle(scale);
        checked && (textStyle = { ...textStyle, ...styles.textChecked });

        return (
            <View style={styles.container}>
                <Animated.View style={style}>
                    <Animated.Text style={textStyle}>Sort</Animated.Text>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 35,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sortButton: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        borderColor: 'black',
        borderWidth: 2
    },
    text: {
        color: 'gray'
    },
    textChecked: {
        color: 'black',
        fontWeight: 'bold'
    }
});