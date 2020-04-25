import React, { Component } from 'react';
import { ButtonWrapper } from '../common/ButtonWrapper';
import { IconOutline } from '@ant-design/icons-react-native';
import { View, StyleSheet } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';

const styles = StyleSheet.create({
    AddSpendingButton: {
        borderRadius: 50,
        width: 60,
        height: 60,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -5
    },
    addSpendingIcon: {
        fontSize: 45,
    }
})

interface IAddSpendingButtonProps {
    onPress: () => void
    disabled: boolean
    scheme: ColorScheme
}

export class AddSpendingButton extends Component<IAddSpendingButtonProps> {
    constructor(props: IAddSpendingButtonProps) {
        super(props);
        this.state = {};
    }

    render() {
        return <ButtonWrapper
            renderNormal={this.renderNormal}
            renderPressed={this.renderPressed}
            onPress={this.props.onPress}
            disabled={this.props.disabled}
        />
    }

    renderNormal = () => {
        return <View style={styles.AddSpendingButton}>
            <IconOutline style={{
                ...styles.addSpendingIcon,
                color: this.props.disabled ? this.props.scheme.inactive : this.props.scheme.primary
            }}
                name='plus-circle'
            />
        </View>;
    }
    renderPressed = () => {
        return <View style={[styles.AddSpendingButton, { backgroundColor: this.props.scheme.primary }]}>
            <IconOutline style={[styles.addSpendingIcon, { color: 'white' }]} name='plus-circle' />
        </View>;
    }
}