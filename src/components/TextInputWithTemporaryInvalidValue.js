
import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class TextInputWithTemporaryInvalidValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTemporaryInvalidValue: false,
            temporaryValue: ''
        };
    }

    render() {
        return <TextInput
            placeholder={this.props.placeholder}
            selectTextOnFocus
            style={this.props.style}
            value={this.state.isTemporaryInvalidValue ? this.state.temporaryValue : this.props.value}
            keyboardType='number-pad'
            onChangeText={this.handleOnChange}
            onBlur={this.handleOnBlur}
        />
    }

    handleOnChange = (text) => {
        if (this.props.isValidValue(text)) {
            this.props.onChange(text);
            this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' });
        }
        else {
            this.setState({ isTemporaryInvalidValue: true, temporaryValue: text });
        }
    }

    handleOnBlur = () => {
        this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' })
    }
}