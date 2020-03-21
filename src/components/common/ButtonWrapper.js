import React, { Component } from 'react';
import { View } from 'react-native';

export class ButtonWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = { isPressed: false }
    }

    render() {
        return <View
            ref={this.props.forwardedRef}
            onStartShouldSetResponder={() => !this.props.disabled}
            onResponderGrant={this.onGrant}
            onResponderRelease={this.onRelease}
            onResponderTerminate={this.onTerminate}
            style={this.props.style}
        >
            {
                this.state.isPressed ? this.props.renderPressed() : this.props.renderNormal()
            }
        </View>
    }

    onRelease = () => {
        this.props.onPress();
        this.setState({ isPressed: false });
    }

    onGrant = () => this.setState({ isPressed: true })

    onTerminate = () => this.setState({ isPressed: false })
}