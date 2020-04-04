import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { keyButtonStyle } from './commonStyles';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    keyDigitText: {
        color: 'rgb(90, 200, 250)',
        fontSize: 40
    },
    keyDigitButtonPressed: {
        backgroundColor: 'rgb(90, 200, 250)'
    }
})

export class KeyBoardDigitButton extends Component {
    render() {
        return <ButtonWrapper renderNormal={this.renderNormal} renderPressed={this.renderPressed} onPress={this.props.onPress} />
    }

    renderNormal = () => {
        return <View style={keyButtonStyle}>
            <Text style={styles.keyDigitText}>{this.props.digit}</Text>
        </View>;
    }
    renderPressed = () => {
        return <View style={[keyButtonStyle, styles.keyDigitButtonPressed]}>
            <Text style={[styles.keyDigitText, { color: 'white' }]}>{this.props.digit}</Text>
        </View>;
    }
}
