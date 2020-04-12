import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ButtonWrapper } from './common/ButtonWrapper';
import { ColorScheme } from '../color/ColorScheme';

export function SortButton({ onPress, checked, scheme }: { onPress: (position: { x: number, y: number }) => void, checked: boolean, scheme: ColorScheme }) {

    const styles = getStyles(scheme);

    return <ButtonWrapper
        renderNormal={renderNormal}
        renderPressed={renderNormal}
        onPress={onPress}
        disabled={false}
    />

    function renderNormal() {
        const containerStyle = checked
            ? { ...styles.sortButton, ...styles.checked }
            : styles.sortButton;
        const textStyle = checked ? styles.textChecked : styles.text;

        return <View style={containerStyle}>
            <Text style={textStyle}>Sort</Text>
        </View>
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    sortButton: {
        borderWidth: 1,
        borderRadius: 20,
        height: 32,
        width: 48,
        borderColor: scheme.inactive,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        borderColor: scheme.primaryText,
        borderWidth: 2
    },
    pressed: {
        borderColor: scheme.primaryText,
        borderWidth: 1
    },
    text: {
        color: scheme.inactive,
        fontSize: 12
    },
    textChecked: {
        fontSize: 12,
        color: scheme.primaryText,
        fontWeight: 'bold'
    }
});