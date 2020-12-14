import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyBoardButton } from './KeyBoardDigitButton';
import { ColorScheme } from '../../../color/ColorScheme';
import { Locale } from '../../../locale/Locale';

export type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.';

const styles = StyleSheet.create({
    keyBoard: {
        justifyContent: 'center',
        marginBottom: -4,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 4,
        marginLeft: -8
    }
});

interface IKeyBoardProps {
    onKeyPressed: (key: Key) => void
    onRemoveKeyPressed: () => void
    scheme: ColorScheme
    locale: Locale
}

export function KeyBoard({ onKeyPressed, onRemoveKeyPressed, scheme, locale }: IKeyBoardProps) {

    const digitProps = {
        scheme: scheme,
        color: scheme.primaryText,
        fontSize: 28,
        height: 56,
        disabled: false
    };

    return <View style={styles.keyBoard}>
        <View style={styles.row}>
            <KeyBoardButton text='1' onPress={() => onKeyPressed('1')} {...digitProps} />
            <KeyBoardButton text='2' onPress={() => onKeyPressed('2')} {...digitProps} />
            <KeyBoardButton text='3' onPress={() => onKeyPressed('3')} {...digitProps} />
        </View>
        <View style={styles.row}>
            <KeyBoardButton text='4' onPress={() => onKeyPressed('4')} {...digitProps} />
            <KeyBoardButton text='5' onPress={() => onKeyPressed('5')} {...digitProps} />
            <KeyBoardButton text='6' onPress={() => onKeyPressed('6')} {...digitProps} />
        </View>
        <View style={styles.row}>
            <KeyBoardButton text='7' onPress={() => onKeyPressed('7')} {...digitProps} />
            <KeyBoardButton text='8' onPress={() => onKeyPressed('8')} {...digitProps} />
            <KeyBoardButton text='9' onPress={() => onKeyPressed('9')} {...digitProps} />
        </View>
        <View style={styles.row}>
            <KeyBoardButton text='.' onPress={() => onKeyPressed('.')} {...digitProps} />
            <KeyBoardButton text='0' onPress={() => onKeyPressed('0')} {...digitProps} />
            <KeyBoardButton
                text={locale.erase}
                onPress={onRemoveKeyPressed}
                scheme={scheme}
                color={scheme.danger}
                fontSize={14}
                height={56}
                disabled={false}
            />
        </View>
    </View>
}
