
import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { formatMoney } from '../domain/NumberFormat';

class AmountInput extends Component {
    constructor(props) {
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

    handleOnChange = (text) => {
        this.setState({ isTemporaryInvalidValue: true, temporaryValue: text });
    }

    handleOnBlur = () => {
        const parsedNumber = this.parseNumber(this.state.temporaryValue);
        if (parsedNumber !== NaN && parsedNumber !== 0) {
            this.props.onChange(parsedNumber);
        }
        this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' })
    }

    parseNumber = (numberString) => {
        return Number(numberString.replace(/\u2009/g, ''))
    }
}

export default AmountInput;