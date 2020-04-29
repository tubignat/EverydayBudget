import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ColorScheme } from '../../../color/ColorScheme';
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

    return <TouchableOpacity style={styles.button} onPress={props.onPress} disabled={props.disabled}>
        <Text style={styles.text}>
            {props.text}
        </Text>
    </TouchableOpacity>
}

const getStyles = (props: IKeyBoardDigitButtonProps) => StyleSheet.create({
    button: {
        height: props.height,
        backgroundColor: props.scheme.buttonBackground,
        borderWidth: 1,
        borderColor: props.scheme.buttonBorder,
        width: '33%',
        marginLeft: 4,
        marginBottom: 4,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: props.fontSize,
        color: props.color
    }
})
