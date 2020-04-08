
import React, { Component } from 'react';
import { TextInput, StyleProp, TextStyle } from 'react-native';
import { formatMoney } from '../NumberFormat';

interface IAmountInputProps {
    forwardedRef?: React.Ref<TextInput>
    placeholder: string
    style: StyleProp<TextStyle>
    value: number
    onChange: (value: number) => void
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

    render() {
        return <TextInput
            ref={this.props.forwardedRef}
            placeholder={this.props.placeholder}
            selectTextOnFocus
            style={this.props.style}
            value={formatMoney(this.state.isTemporaryInvalidValue ? this.parseNumber(this.state.temporaryValue) : this.props.value)}
            keyboardType='number-pad'
            onChangeText={this.handleOnChange}
            onBlur={this.handleOnBlur}
        />
    }

    handleOnChange = (text: string) => {
        this.setState({ isTemporaryInvalidValue: true, temporaryValue: text });
    }

    handleOnBlur = () => {
        const parsedNumber = this.parseNumber(this.state.temporaryValue);
        if (parsedNumber !== NaN && parsedNumber !== 0) {
            this.props.onChange(parsedNumber);
        }
        this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' })
    }

    parseNumber = (numberString: string) => {
        return Number(numberString.replace(/\u2009/g, ''))
    }
}

export default AmountInput;