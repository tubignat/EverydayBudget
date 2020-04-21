
import React, { useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, PointPropType } from 'react-native';
import { ColorScheme } from '../color/ColorScheme';

interface IPickerModalProps {
    scheme: ColorScheme
    width: number
    expansionPoint: { x: number, y: number }
    isOpen: boolean
    onBackdropClick: () => void
    children: JSX.Element
    onOpenAnimationStart: () => void
    onCloseAnimationStart: () => void
}

const window = Dimensions.get('window');

export function PickerModal(props: IPickerModalProps) {
    const styles = getStyles(props.scheme);

    const [scale] = useState(new Animated.Value(props.isOpen ? 1 : 0));
    const [zIndex, setZIndex] = useState(props.isOpen ? 1 : 0);
    const [isOpenInner, setIsOpenInner] = useState(props.isOpen);

    if (props.isOpen && !isOpenInner) {
        setIsOpenInner(true);
        open();
    }

    if (!props.isOpen && isOpenInner) {
        setIsOpenInner(false);
        close();
    }

    const backdropColor = scale.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .6)']
    })

    const opacity = scale.interpolate({
        inputRange: [0, .2, 1],
        outputRange: [0, 1, 1]
    })

    const translateX = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [getOffsetX(), 0]
    })

    const translateY = scale.interpolate({
        inputRange: [0, 1],
        outputRange: [getOffsetY(), 0]
    })

    return <Animated.View style={{
        ...styles.backdrop,
        backgroundColor: backdropColor,
        zIndex: zIndex
    }}>
        <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={() => props.isOpen && props.onBackdropClick()}>
            <View style={styles.backdropTouchableInner} />
        </TouchableWithoutFeedback>
        <Animated.View style={{ position: 'absolute', transform: [{ translateX: translateX }, { translateY: translateY }] }}>
            <Animated.View style={{
                ...styles.container,
                left: window.width / 2 - props.width / 2,
                width: props.width,
                opacity: opacity,
                transform: [{ scale: scale }]
            }}>
                {
                    props.children
                }
            </Animated.View>
        </Animated.View>
    </Animated.View>

    function open() {
        setZIndex(1);
        props.onOpenAnimationStart();
        Animated.spring(scale, { toValue: 1 }).start();
    }

    function close() {
        props.onCloseAnimationStart();
        Animated.timing(scale, { toValue: 0, duration: 300 }).start(() => setZIndex(0));
    }

    function getOffsetY() {
        return props.expansionPoint.y - window.height / 2;
    }

    function getOffsetX() {
        return props.expansionPoint.x - window.width / 2;
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center'
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
    container: {
        backgroundColor: scheme.pickerModalBackground,
        borderRadius: 30,
        overflow: 'hidden',
    }
})
