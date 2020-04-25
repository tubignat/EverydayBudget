import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyBoardDigitButton } from './KeyBoardDigitButton';
import { KeyBoardRemoveButton } from './KeyBoardRemoveButton';
import { Key } from './keyboardCommon'

const styles = StyleSheet.create({
    keyBoard: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

interface IKeyBoardProps {
    onKeyPressed: (key: Key) => void
    onRemoveKeyPressed: () => void
    color: string
}

export function KeyBoard({ onKeyPressed, onRemoveKeyPressed, color }: IKeyBoardProps) {

    return <View style={styles.keyBoard}>
        <View style={styles.row}>
            <KeyBoardDigitButton digit={'1'} onPress={() => onKeyPressed('1')} color={color} />
            <KeyBoardDigitButton digit={'2'} onPress={() => onKeyPressed('2')} color={color} />
            <KeyBoardDigitButton digit={'3'} onPress={() => onKeyPressed('3')} color={color} />
        </View>
        <View style={styles.row}>
            <KeyBoardDigitButton digit={'4'} onPress={() => onKeyPressed('4')} color={color} />
            <KeyBoardDigitButton digit={'5'} onPress={() => onKeyPressed('5')} color={color} />
            <KeyBoardDigitButton digit={'6'} onPress={() => onKeyPressed('6')} color={color} />
        </View>
        <View style={styles.row}>
            <KeyBoardDigitButton digit={'7'} onPress={() => onKeyPressed('7')} color={color} />
            <KeyBoardDigitButton digit={'8'} onPress={() => onKeyPressed('8')} color={color} />
            <KeyBoardDigitButton digit={'9'} onPress={() => onKeyPressed('9')} color={color} />
        </View>
        <View style={styles.row}>
            <KeyBoardDigitButton digit={'.'} onPress={() => onKeyPressed('.')} color={color} />
            <KeyBoardDigitButton digit={'0'} onPress={() => onKeyPressed('0')} color={color} />
            <KeyBoardRemoveButton onPress={onRemoveKeyPressed} color={color} />
        </View>
    </View>
}