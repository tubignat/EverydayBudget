import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { Text, View } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';

interface ITextButtonProps {
    forwardedRef?: React.Ref<View>
    forwardedTextRef?: React.Ref<View>
    height: number
    width?: number | string
    disabled: boolean
    fontSize: number
    scheme: ColorScheme
    text: string
    onPress: (position: { x: number, y: number }) => void
}

export class TextButton extends Component<ITextButtonProps> {
    constructor(props: ITextButtonProps) {
        super(props);
        this.state = {};
    }

    render() {
        return <ButtonWrapper
            forwardedRef={this.props.forwardedRef}
            style={{ height: this.props.height, width: this.props.width, justifyContent: 'center', alignItems: 'center' }}
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <Text ref={this.props.forwardedTextRef} style={{ fontSize: this.props.fontSize, color: this.props.scheme.primary }}>
            {this.props.text}
        </Text>;
    }
    renderPressed = () => {
        return <Text ref={this.props.forwardedTextRef} style={{ fontSize: this.props.fontSize, color: this.props.scheme.primaryText }}>
            {this.props.text}
        </Text>;
    }
}