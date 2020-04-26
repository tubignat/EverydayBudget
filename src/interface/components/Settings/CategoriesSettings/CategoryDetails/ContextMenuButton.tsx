import React from 'react';
import { TouchableHighlight, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ColorScheme } from '../../../../color/ColorScheme';

interface IContextMenuButtonProps {
    text: string
    color: string
    onPress: () => void
    scheme: ColorScheme
}

export function ContextMenuButton(props: IContextMenuButtonProps) {
    const styles = getStyles(props.scheme, props.color);

    return <TouchableOpacity style={styles.container} onPress={props.onPress} activeOpacity={.5}>
        <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
}

const getStyles = (scheme: ColorScheme, textColor: string) => StyleSheet.create({
    container: {
        height: 60,
        marginTop: 12,
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: scheme.background
    },
    text: {
        fontSize: 20,
        color: textColor
    }
})

