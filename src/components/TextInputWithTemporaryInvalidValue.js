
import React, { Component } from 'react';
import { TextInput } from 'react-native';

class TextInputWithTemporaryInvalidValue extends Component {
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
            value={this.state.isTemporaryInvalidValue ? this.state.temporaryValue : this.props.value}
            keyboardType='number-pad'
            onChangeText={this.handleOnChange}
            onBlur={this.handleOnBlur}
        />
    }

    handleOnChange = (text) => {
        this.setState({ isTemporaryInvalidValue: true, temporaryValue: text });
    }

    handleOnBlur = () => {
        if (this.props.isValidValue(this.state.temporaryValue)) {
            this.props.onChange(this.state.temporaryValue);
        }
        this.setState({ isTemporaryInvalidValue: false, temporaryValue: '' })
    }
}

export default TextInputWithTemporaryInvalidValue;