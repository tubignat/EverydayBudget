import React from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import { View } from 'react-native';
import { keyButtonStyle } from './keyboardCommon';

export function KeyBoardRemoveButton({ onPress, color }: { onPress: () => void, color: string }) {

    return <ButtonWrapper renderNormal={renderNormal} renderPressed={renderPressed} onPress={onPress} disabled={false} />

    function renderNormal() {
        return <View style={keyButtonStyle}>
            <IconOutline style={{ fontSize: 40, color: color }} name='close-circle' />
        </View>;
    }
    function renderPressed() {
        return <View style={{ ...keyButtonStyle, backgroundColor: color }}>
            <IconOutline style={{ fontSize: 40, color: 'white' }} name='close-circle' />
        </View>;
    }
}