import React, { Component } from 'react';
import { ButtonWrapper } from './common/ButtonWrapper';
import { IconOutline, OutlineGlyphMapType } from '@ant-design/icons-react-native';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

interface IIconButtonProps {
    size: number
    innerSize: number
    onPress: () => void
    color: string
    icon: OutlineGlyphMapType
    disabled: boolean
}

export class IconButton extends Component<IIconButtonProps> {
    constructor(props: IIconButtonProps) {
        super(props);
        this.state = {};
    }

    render() {
        return <ButtonWrapper
            style={{ width: this.props.size, height: this.props.size }}
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <View style={styles.button}>
            <IconOutline style={{ fontSize: this.props.innerSize, color: this.props.color }} name={this.props.icon} />
        </View>;
    }
    renderPressed = () => {
        return <View style={[styles.button, { backgroundColor: this.props.color }]}>
            <IconOutline style={{ fontSize: this.props.innerSize, color: 'white' }} name={this.props.icon} />
        </View>;
    }
}