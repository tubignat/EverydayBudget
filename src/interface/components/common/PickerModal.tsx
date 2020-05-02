import React, { useState, useEffect } from 'react';
import { View, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';

interface IPickerModalProps {
    scheme: ColorScheme
    width: number
    expansionPoint: { x: number, y: number }
    renderContent: (close: () => void) => JSX.Element
    onClose: () => void
    onOpenAnimationStart: () => void
    onCloseAnimationStart: () => void
}

const window = Dimensions.get('window');

export function PickerModal(props: IPickerModalProps) {
    const [scale] = useState(new Animated.Value(0));

    useEffect(open, []);

    const styles = getStyles(props.scheme, scale, props.width, props.expansionPoint);

    return <Animated.View style={styles.backdrop}>
        <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={close}>
            <View style={styles.backdropTouchableInner} />
        </TouchableWithoutFeedback>
        <Animated.View style={styles.containerWrapper}>
            <Animated.View style={styles.container}>
                {
                    props.renderContent(close)
                }
            </Animated.View>
        </Animated.View>
    </Animated.View>

    function open() {
        props.onOpenAnimationStart();
        Animated.spring(scale, { toValue: 1 }).start();
    }

    function close() {
        props.onCloseAnimationStart();
        Animated.timing(scale, { toValue: 0, duration: 250 }).start(props.onClose);
    }
}

function getStyles(
    scheme: ColorScheme,
    scale: Animated.Value,
    width: number,
    expansionPoint: { x: number, y: number }
): any {
    const wrapperTranslateX = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [getOffsetX(expansionPoint), 0]
    })

    const wrapperTranslateY = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [getOffsetY(expansionPoint), 0]
    })

    const opacity = scale.interpolate({
        inputRange: [0, .3, 1],
        outputRange: [0, 1, 1]
    })

    return {
        backdrop: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            zIndex: 20,
            backgroundColor: scale.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .6)']
            })
        },
        backdropTouchable: {
            width: '100%',
            height: '100%',
        },
        backdropTouchableInner: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        containerWrapper: {
            position: 'absolute',
            transform: [
                { translateX: wrapperTranslateX },
                { translateY: wrapperTranslateY }
            ]
        },
        container: {
            backgroundColor: scheme.pickerModalBackground,
            borderRadius: 20,
            overflow: 'hidden',
            left: window.width / 2 - width / 2,
            width: width,
            opacity: opacity,
            transform: [
                { scale: scale }
            ]
        }
    }
};

function getOffsetY(expansionPoint: { x: number, y: number }) {
    return expansionPoint.y - window.height / 2;
}

function getOffsetX(expansionPoint: { x: number, y: number }) {
    return expansionPoint.x - window.width / 2;
}