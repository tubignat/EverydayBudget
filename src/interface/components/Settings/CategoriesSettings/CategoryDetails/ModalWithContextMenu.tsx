import React, {useEffect, useState} from 'react';
import {View, Animated, TouchableWithoutFeedback, Keyboard, PanResponder, Dimensions, SafeAreaView} from 'react-native';
import {ContextMenuButton} from './ContextMenuButton';
import {ColorScheme} from '../../../../color/ColorScheme';

interface IContextMenuButton {
    text: string
    color: string
    onPress: () => void
}

interface IModalWithContextMenuProps {
    scheme: ColorScheme
    buttons: IContextMenuButton[]
    onClose: () => void
    children: JSX.Element
}

const offset = 460;
const window = Dimensions.get('window');

const isSmallScreen = window.width < 350;
const isBigScreen = window.height > 800;

export function ModalWithContextMenu(props: IModalWithContextMenuProps) {
    const [translateY] = useState(new Animated.Value(offset))
    useEffect(open, []);

    const [isBeingClose, setIsBeingClosed] = useState(false);
    const [panResponder] = useState(createPanResponder());
    const styles = getStyles(props.scheme, translateY);

    return <Animated.View style={styles.backdrop}>

        <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={handleBackdropPress}>
            <View style={styles.backdropTouchableInner}/>
        </TouchableWithoutFeedback>

        <SafeAreaView>
            <Animated.View style={styles.container}>
                <View style={styles.content} {...panResponder.panHandlers}>
                    <View style={styles.handleContainer}>
                        <View style={styles.handle}/>
                    </View>
                    {props.children}
                </View>
                {
                    props.buttons.map(button =>
                        <ContextMenuButton
                            key={button.text}
                            text={button.text}
                            color={button.color}
                            onPress={() => handleButtonPress(button.onPress)}
                            scheme={props.scheme}
                        />
                    )
                }
            </Animated.View>
        </SafeAreaView>
    </Animated.View>

    function open() {
        Animated.spring(translateY, {toValue: 0, bounciness: 1, speed: 25, useNativeDriver: false}).start();
    }

    function close(duration: number) {
        setIsBeingClosed(true);
        Animated.timing(translateY, {toValue: offset, duration: duration, useNativeDriver: false}).start(props.onClose);
    }

    function handleButtonPress(onPress: () => void) {
        if (!isBeingClose) {
            onPress();
            close(250);
        }
    }

    function handleBackdropPress() {
        Keyboard.dismiss();
        close(250);
    }

    function createPanResponder() {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: Keyboard.dismiss,
            onPanResponderMove: Animated.event([null, {
                dy: translateY
            }], {useNativeDriver: false}),
            onPanResponderRelease: (_, gesture) => {
                const threshold = gesture.dy > window.height / 4 ? 0 : 1;
                const duration = (1 - gesture.dy / offset) * 250;
                gesture.vy <= threshold
                    ? Animated.spring(translateY, {toValue: 0, useNativeDriver: false}).start()
                    : close(duration > 100 ? duration : 100);
            }
        });
    }
}

function getStyles(scheme: ColorScheme, translateY: Animated.Value): any {

    const limitedTranslateY = translateY.interpolate({
        inputRange: [-200, -150, -100, -50, 0, offset],
        outputRange: [-52.5, -50, -45, -25, 0, offset]
    })

    return {
        backdrop: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            alignContent: 'center',
            zIndex: 30,
            backgroundColor: limitedTranslateY.interpolate({
                inputRange: [0, offset],
                outputRange: ['rgba(0, 0, 0, .75)', 'rgba(0, 0, 0, 0)']
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
        container: {
            marginHorizontal: 16,
            marginVertical: 8,
            transform: [
                {translateY: limitedTranslateY}
            ],
        },
        content: {
            backgroundColor: scheme.pickerModalBackground,
            paddingVertical: 32,
            paddingHorizontal: isSmallScreen ? 24 : 32,
            paddingTop: 0,
            borderRadius: 16
        },
        handleContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: '100%',
            marginBottom: 8
        },
        handle: {
            width: 40,
            height: 6,
            backgroundColor: 'lightgray',
            borderRadius: 4
        }
    }
};
