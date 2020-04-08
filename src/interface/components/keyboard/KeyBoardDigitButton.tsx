import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { keyButtonStyle, Key } from './keyboardCommon';
import { View, Text, StyleSheet } from 'react-native';
interface IKeyBoardDigitButtonProps {
    digit: Key
    onPress: () => void
    color: string
}

export class KeyBoardDigitButton extends Component<IKeyBoardDigitButtonProps> {
    render() {
        return <ButtonWrapper
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={false}
        />
    }

    renderNormal = () => {
        return <View style={keyButtonStyle}>
            <Text style={{ fontSize: 40, color: this.props.color }}>{this.props.digit}</Text>
        </View>;
    }
    renderPressed = () => {
        return <View style={{ ...keyButtonStyle, backgroundColor: this.props.color }}>
            <Text style={{ color: 'white', fontSize: 40 }}>{this.props.digit}</Text>
        </View>;
    }
}
