
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import { formatMoney } from '../../NumberFormat';
import { Currency } from '../../../domain/repositories/UserPreferencesRepository';

interface IAmountInputProps {
    placeholder: string
    value: number
    maxValue: number
    currency: Currency
    fontSize: number
    color: string
    width?: number | string
    height?: number | string
    onChange: (value: number) => void
    setRef?: (ref: TextInput | null) => void
}

interface IAmountInputState {
    isTemporaryInvalidValue: boolean
    temporaryValue: string
}

class AmountInput extends Component<IAmountInputProps, IAmountInputState> {
    constructor(props: IAmountInputProps) {
        super(props);
        this.state = {
            isTemporaryInvalidValue: false,
            temporaryValue: ''
        };
    }

    textInputRef: TextInput | null = null;

    render() {
        const value = this.state.isTemporaryInvalidValue ? this.getValueToRender(this.state.temporaryValue) : this.props.value;

        return <TouchableWithoutFeedback onPress={() => this.textInputRef?.focus()}>
            <View style={{ ...styles.incomeViewAmount, width: this.props.width, height: this.props.height }}>
                <TextInput
                    ref={ref => {
                        this.textInputRef = ref;
                        this.props.setRef?.(ref);
                    }}
                    placeholder={this.props.placeholder}
                    selectTextOnFocus
                    style={{ fontSize: this.props.fontSize, color: this.props.color }}
                    value={value === '' ? value : formatMoney(value)}
                    keyboardType='number-pad'
                    onChangeText={this.handleOnChange}
                    onBlur={this.handleOnBlur}
                />
                <Text style={{ fontSize: this.props.fontSize, color: this.props.color }}> {this.props.currency}</Text>
            </View>
        </TouchableWithoutFeedback>
    }

    handleOnChange = (text: string) => {
        const parsedNumber = this.getValueToRender(text);
        if (text === '' || parsedNumber !== NaN && parsedNumber <= this.props.maxValue) {
            this.setState({ isTemporaryInvalidValue: true, temporaryValue: text });
        }
    }

    handleOnBlur = () => {
        const parsedNumber = this.getValueToRender(this.state.temporaryValue);
        if (parsedNumber !== NaN && parsedNumber !== '' && parsedNumber > 0 && parsedNumber <= this.props.maxValue) {
            this.props.onChange(parsedNumber);
        }
        this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' })
    }

    getValueToRender = (numberString: string) => {
        return numberString
            ? Number(numberString.replace(/\u2009/g, ''))
            : '';
    }
}

const styles = StyleSheet.create({
    incomeViewAmount: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
})

export default AmountInput;