import React, { Component } from 'react';
import { View, ViewStyle } from 'react-native';

interface IButtonWrapperProps {
    forwardedRef?: React.Ref<View>
    style?: ViewStyle
    disabled: boolean
    renderPressed: () => JSX.Element
    renderNormal: () => JSX.Element
    onPress: () => void
}

interface IButtonWrapperState {
    isPressed: boolean
}

export class ButtonWrapper extends Component<IButtonWrapperProps, IButtonWrapperState> {
    constructor(props: IButtonWrapperProps) {
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