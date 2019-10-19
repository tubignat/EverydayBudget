
import React, { Component } from 'react';
import { Animated, PanResponder, TouchableWithoutFeedback, ScrollView, View, Text, TextInput, Dimensions, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';

let Window = Dimensions.get('window');
class SlidingUpPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.Value(Window.height - 20)
        }
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {
                dy: this.state.pan
            }]),
            onPanResponderRelease: (e, gesture) => {
                if (gesture.vy <= 0)
                    Animated.spring(this.state.pan, { toValue: 0 }).start();
                else
                    this.close();
            }
        });

        Animated.spring(this.state.pan, { toValue: 0 }).start();
    }

    render() {
        const offsetTop = this.props.offsetTop;
        const height = Window.height - offsetTop;

        const top = this.state.pan.interpolate({
            inputRange: [-200, -100, -50, 0, height / 2, height],
            outputRange: [-50, -40, -25, 0, height / 2, height]
        })
        const opacity = top.interpolate({
            inputRange: [0, height / 2, height],
            outputRange: [0.5, 0.25, 0]
        });

        return (
            <View style={styles.mainContainer}>

                <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={this.close} on>
                    <Animated.View style={[styles.backdrop, { opacity: opacity }]} />
                </TouchableWithoutFeedback>

                <View style={[styles.container, { top: this.props.offsetTop }]}>
                    <Animated.View style={[{ top: top }, styles.draggablePanel]} >
                        <View style={styles.handleContainer} {...this.panResponder.panHandlers}>
                            <View style={styles.handle} />
                        </View>
                    </Animated.View>
                </View>

            </View>
        );
    }

    close = () => {
        Animated
            .spring(this.state.pan, { toValue: Window.height, restSpeedThreshold: 100, restDisplacementThreshold: 40 })
            .start(this.props.onClose);
    }
}

let styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
    },
    backdropTouchable: {
        height: '100%',
        width: '100%'
    },
    backdrop: {
        backgroundColor: 'black',
        opacity: .5,
        position: 'absolute',
        height: '100%',
        width: '100%'
    },
    container: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2
    },
    draggablePanel: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%'
    },
    handleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    handle: {
        width: 50,
        height: 7,
        backgroundColor: 'lightgray',
        borderRadius: 50
    }
});

export default SlidingUpPanel;