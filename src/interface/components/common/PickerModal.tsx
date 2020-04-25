
import React, { useState, useEffect } from 'react';
import { View, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';
import { ModalStackState } from '../../ModalStackState';

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
    useEffect(setMainViewStyle, []);
    useEffect(() => {
        return clearMainViewStyle;
    }, [])

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
        Animated.spring(scale, { toValue: 1, bounciness: 0 }).start();
    }

    function close() {
        props.onCloseAnimationStart();
        Animated.timing(scale, { toValue: 0, duration: 300 }).start(props.onClose);
    }

    function setMainViewStyle() {
        const mainViewScale = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95]
        });

        const borderRadius = scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20]
        })

        const mainViewStyle = {
            transform: [{ scale: mainViewScale }],
            borderRadius: borderRadius
        };

        ModalStackState.setMainViewStyle(mainViewStyle, {});
    }

    function clearMainViewStyle() {
        ModalStackState.setMainViewStyle({}, {});
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
        inputRange: [0, .2, 1],
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
            zIndex: 1,
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
            borderRadius: 30,
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