import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { ButtonWrapper } from './common/ButtonWrapper';

type SelectorButton = {
    text: string
    onPress: () => void
    selected: boolean
}

export function Selector({ buttons }: { buttons: SelectorButton[] }) {

    const [animatedButtons] = React.useState(buttons.map(button => {
        return {
            ...button,
            animated: button.selected ? new Animated.Value(50) : new Animated.Value(40),
        }
    }));

    useEffect(() => {
        const updatedValues = animatedButtons.filter(ab => buttons.find(b => b.text === ab.text)?.selected !== ab.selected);

        updatedValues.forEach(value => {
            const toValue = value.selected ? 40 : 50;
            Animated.timing(value.animated, { toValue: toValue, duration: 200 }).start();

            value.selected = !value.selected;
        })
    });

    return (
        <View style={styles.selector}>
            {
                buttons.map(button =>
                    <SelectorButton
                        text={button.text}
                        onPress={button.onPress}
                        containerStyle={getContainerStyle(button)}
                        textStyle={getTextStyle(button)}
                        disabled={button.selected}
                    />
                )
            }
        </View>
    )

    function getContainerStyle(button: SelectorButton) {
        return {
            ...styles.icon,
            width: animatedButtons.find(p => p.text === button.text)?.animated,
            borderColor: button.selected ? 'black' : 'lightgray',
            borderWidth: button.selected ? 2 : 1,
        }
    }

    function getTextStyle(button: SelectorButton) {
        return {
            ...styles.iconText,
            color: button.selected ? 'black' : 'darkgray',
            fontWeight: button.selected ? 'bold' : 'normal',
            fontSize: button.selected ? 16 : 14
        }
    }
}

function SelectorButton({ text, onPress, disabled, containerStyle, textStyle }: any) {
    return <ButtonWrapper
        renderPressed={() => render(true)}
        renderNormal={() => render(false)}
        onPress={onPress}
        disabled={disabled}
    />

    function render(isPressed: boolean) {
        return <Animated.View style={{
            ...containerStyle,
            borderColor: isPressed ? 'black' : containerStyle.borderColor
        }}>
            <Text style={textStyle}>
                {text}
            </Text>
        </Animated.View>
    }
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        borderWidth: 1,
        borderRadius: 50,
        justifyContent: 'center',
        height: 40,
        marginLeft: 10
    },
    iconText: {
        width: '100%',
        textAlign: 'center',
    },
})