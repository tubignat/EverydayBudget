
import React, { Component } from 'react';
import { ButtonWrapper } from './common/ButtonWrapper';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
    }
})

export class TextButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <ButtonWrapper
            style={{ height: this.props.height, justifyContent: 'center' }}
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <Text style={[styles.button, { fontSize: this.props.fontSize, color: 'rgb(0, 122, 255)' }]}>{this.props.text}</Text>;
    }
    renderPressed = () => {
        return <Text style={[styles.button, { fontSize: this.props.fontSize }]}>{this.props.text}</Text>;
    }
}