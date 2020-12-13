import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Animated, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ButtonWrapper} from './ButtonWrapper';
import {ColorScheme} from '../../color/ColorScheme';

type SelectorButton = {
    text: string
    onPress: () => void
    selected: boolean
    width: number
}

export function Selector({buttons, scheme}: { buttons: SelectorButton[], scheme: ColorScheme }) {

    const [animatedButtons] = React.useState(buttons.map(button => {
        return {
            ...button,
            animated: button.selected ? new Animated.Value(button.width + 10) : new Animated.Value(button.width),
        }
    }));

    useEffect(() => {
        const updatedValues = animatedButtons.filter(ab => buttons.find(b => b.text === ab.text)?.selected !== ab.selected);

        updatedValues.forEach(value => {
            const toValue = value.selected ? value.width : value.width + 10;
            Animated.timing(value.animated, {toValue: toValue, duration: 200, useNativeDriver: false}).start();

            value.selected = !value.selected;
        })
    });

    return (
        <View style={styles.selector}>
            {
                buttons.map(button =>
                    <SelectorButton
                        key={button.text}
                        text={button.text}
                        onPress={button.onPress}
                        containerStyle={getContainerStyle(button)}
                        textStyle={getTextStyle(button)}
                        disabled={button.selected}
                        scheme={scheme}
                    />
                )
            }
        </View>
    )

    function getContainerStyle(button: SelectorButton) {
        return {
            ...styles.icon,
            width: animatedButtons.find(p => p.text === button.text)?.animated,
            borderColor: button.selected ? scheme.primary : scheme.secondaryText,
            borderWidth: button.selected ? 2 : 1,
        }
    }

    function getTextStyle(button: SelectorButton): StyleProp<TextStyle> {
        return {
            ...styles.iconText,
            color: button.selected ? scheme.primary : scheme.secondaryText,
            fontWeight: button.selected ? 'bold' : 'normal',
            fontSize: button.selected ? 16 : 14
        }
    }
}


interface ISelectorButtonProps {
    text: string
    onPress: () => void
    disabled: boolean
    containerStyle: any
    textStyle: StyleProp<TextStyle>
    scheme: ColorScheme
}

function SelectorButton({text, onPress, disabled, containerStyle, textStyle, scheme}: ISelectorButtonProps) {
    return <ButtonWrapper
        renderPressed={() => render(true)}
        renderNormal={() => render(false)}
        onPress={onPress}
        disabled={disabled}
    />

    function render(isPressed: boolean) {
        return <Animated.View style={{
            ...containerStyle,
            borderColor: isPressed ? scheme.primaryText : containerStyle.borderColor
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
