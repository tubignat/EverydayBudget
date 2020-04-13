import React, { Component } from 'react';
import { View, ViewStyle, GestureResponderEvent, TouchableWithoutFeedback } from 'react-native';

interface IButtonWrapperProps {
    forwardedRef?: React.Ref<View>
    style?: ViewStyle
    disabled: boolean
    renderPressed: () => JSX.Element
    renderNormal: () => JSX.Element
    onPress: (position: { x: number, y: number }) => void
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
        return <TouchableWithoutFeedback
            onPressIn={this.onGrant}
            onPress={this.onRelease}
            onPressOut={this.onTerminate}
            disabled={this.props.disabled}
        >
            <View ref={this.props.forwardedRef} style={this.props.style} >
                {
                    this.state.isPressed ? this.props.renderPressed() : this.props.renderNormal()
                }
            </View>
        </TouchableWithoutFeedback>
    }

    onRelease = (event: GestureResponderEvent) => {
        this.props.onPress({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
        this.setState({ isPressed: false });
    }

    onGrant = () => this.setState({ isPressed: true })

    onTerminate = () => this.setState({ isPressed: false })
}