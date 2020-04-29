import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ColorScheme } from '../../../../color/ColorScheme';

interface IContextMenuButtonProps {
    text: string
    color: string
    onPress: () => void
    scheme: ColorScheme
}

export function ContextMenuButton(props: IContextMenuButtonProps) {
    const styles = getStyles(props.scheme, props.color);

    return <TouchableOpacity style={styles.container} onPress={props.onPress} activeOpacity={.7}>
        <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
}

const getStyles = (scheme: ColorScheme, textColor: string) => StyleSheet.create({
    container: {
        height: 56,
        marginTop: 12,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: scheme.pickerModalBackground
    },
    text: {
        fontSize: 20,
        color: textColor
    }
})

