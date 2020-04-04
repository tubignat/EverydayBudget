import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ButtonWrapper } from './common/ButtonWrapper';

export function SortButton({ onPress, checked }: { onPress: () => void, checked: boolean }) {
    return <ButtonWrapper
        renderNormal={renderNormal}
        renderPressed={renderNormal}
        onPress={onPress}
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

const styles = StyleSheet.create({
    sortButton: {
        borderWidth: 1,
        borderRadius: 20,
        height: 32,
        width: 48,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        borderColor: 'black',
        borderWidth: 2
    },
    pressed: {
        borderColor: 'black',
        borderWidth: 1
    },
    text: {
        color: 'gray',
        fontSize: 12
    },
    textChecked: {
        fontSize: 12,
        color: 'black',
        fontWeight: 'bold'
    }
});