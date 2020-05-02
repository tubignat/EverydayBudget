import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { ColorScheme } from '../../../color/ColorScheme';
import { ButtonWrapper } from '../../common/ButtonWrapper';
interface IKeyBoardDigitButtonProps {
    text: string
    onPress: () => void
    color: string
    fontSize: number
    height: number
    scheme: ColorScheme
    disabled: boolean
}

export function KeyBoardButton(props: IKeyBoardDigitButtonProps) {
    const styles = getStyles(props);

    return <ButtonWrapper
        renderNormal={renderNormal}
        renderPressed={renderPressed}
        onPress={props.onPress}
        disabled={props.disabled}
        style={styles.button}
    />

    function renderNormal() {
        return <View style={styles.buttonContent}>
            <Text style={styles.text}>
                {props.text}
            </Text>
        </View>
    }

    function renderPressed() {
        return <View style={{ ...styles.buttonContent, backgroundColor: props.scheme.buttonBackgroundPressed }}>
            <Text style={styles.text}>
                {props.text}
            </Text>
        </View>
    }
}

const getStyles = (props: IKeyBoardDigitButtonProps) => StyleSheet.create({
    button: {
        height: props.height,
        width: '33%',
        marginLeft: 4,
        marginBottom: 4,
    },
    buttonContent: {
        backgroundColor: props.scheme.buttonBackground,
        borderWidth: 1,
        borderColor: props.scheme.buttonBorder,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: props.fontSize,
        color: props.color
    }
})
