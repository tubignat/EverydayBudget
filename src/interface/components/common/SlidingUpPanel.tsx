import React from 'react';
import {
    Animated,
    PanResponder,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    Dimensions,
    StyleSheet,
    PanResponderInstance,
    ScrollView,
    GestureResponderEvent
} from 'react-native';
import {ModalStackState} from '../../ModalStackState';
import {ColorScheme} from '../../color/ColorScheme';

const Window = Dimensions.get('window');

const isSmallScreen = Window.width < 350;
const isBigScreen = Window.height > 800;

interface ISlidingUpPanelProps {
    offsetTop: number
    colorScheme: ColorScheme
    onClose: () => void
}

interface ISlidingUpPanelState {
    pan: Animated.Value
    scroll: number
    scrollContentOffset: number
}

class SlidingUpPanel extends React.Component<ISlidingUpPanelProps, ISlidingUpPanelState> {

    private panResponder: PanResponderInstance;

    constructor(props: ISlidingUpPanelProps) {
        super(props);
        this.state = {
            pan: new Animated.Value(Window.height - 20),
            scroll: 0,
            scrollContentOffset: 0
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                return true;
            },
            onPanResponderMove: Animated.event([null, {
                dy: this.state.pan
            }], {useNativeDriver: false}),
            onPanResponderRelease: (e, gesture) => {
                const threshold = gesture.dy > Window.height / 4 ? 0 : 1;
                if (gesture.vy <= threshold)
                    Animated.spring(this.state.pan, {toValue: 0, useNativeDriver: false}).start();
                else
                    this.close();
            }
        });

        Animated.spring(this.state.pan, {toValue: 0, bounciness: 0, useNativeDriver: false}).start();
    }

    componentDidMount() {
        const offsetTop = this.props.offsetTop;
        const height = Window.height - offsetTop;

        const mainViewScale = this.state.pan.interpolate({
            inputRange: [0, height, height + 200],
            outputRange: [0.925, 1, 1]
        })

        const translateY = mainViewScale.interpolate({
            inputRange: [0.925, 1],
            outputRange: [isBigScreen ? 30 : 15, 0]
        });

        const borderRadius = mainViewScale.interpolate({
            inputRange: [0.925, 1],
            outputRange: [20, 0]
        });

        const background = mainViewScale.interpolate({
            inputRange: [0.925, 0.950, 1],
            outputRange: [this.props.colorScheme.lightBackground, this.props.colorScheme.background, this.props.colorScheme.background]
        });

        const contentOpacity = mainViewScale.interpolate({
            inputRange: [0.925, 0.94, 1],
            outputRange: [0, 1, 1]
        })

        ModalStackState.setMainViewStyle({
            transform: [{scale: mainViewScale}, {translateY: translateY}],
            borderRadius: borderRadius,
            backgroundColor: background
        }, {
            opacity: contentOpacity
        });
    }

    componentWillUnmount() {
        ModalStackState.setMainViewStyle({}, {});
    }

    render() {
        const offsetTop = this.props.offsetTop;
        const height = Window.height - offsetTop;

        const top = this.state.pan.interpolate({
            inputRange: [-200, -100, -50, 0, height / 2, height],
            outputRange: [-15, -15, -10, 0, height / 2, height]
        });
        const opacity = top.interpolate({
            inputRange: [0, height / 2, height],
            outputRange: [0, 0, 0]
        });

        let previousY = Window.height;
        let previousTimestamp = 0;

        const scrollViewResponders = {
            ...this.panResponder.panHandlers,
            onStartShouldSetPanResponder: () => {
                return false;
            },
            onMoveShouldSetResponder: (event: GestureResponderEvent) => {
                const result = event.nativeEvent.touches[0];

                if (result.timestamp - previousTimestamp > 50) {
                    previousY = result.pageY;
                    previousTimestamp = result.timestamp;
                    return false;
                }

                if (this.state.scroll <= 0 && result.pageY > previousY) {
                    return true;
                }

                previousTimestamp = result.timestamp;
                previousY = result.pageY;
                return false
            }
        };

        return (
            <View style={styles.mainContainer}>

                <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={this.close}>
                    <Animated.View style={[styles.backdrop, {opacity: opacity}]}/>
                </TouchableWithoutFeedback>

                <View style={[styles.container, {top: this.props.offsetTop}]}>
                    <Animated.View
                        style={[{top: top, backgroundColor: this.props.colorScheme.background}, styles.draggablePanel]}>
                        <View style={styles.handleContainer} {...this.panResponder.panHandlers}>
                            <View style={{...styles.handleAura, backgroundColor: this.props.colorScheme.background}}>
                                <View style={styles.handle}/>
                            </View>
                        </View>
                        <View style={{height: Window.height - offsetTop - 7}} {...scrollViewResponders}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{paddingHorizontal: 20, paddingVertical: 40}}
                                onScroll={event => this.setState({scroll: event.nativeEvent.contentOffset.y})}
                                scrollEventThrottle={16}
                            >
                                <View onStartShouldSetResponder={() => true}>
                                    {this.props.children}
                                </View>
                            </ScrollView>
                        </View>
                    </Animated.View>
                </View>

            </View>
        );
    }

    close = () => {
        Animated
            .spring(this.state.pan, {
                toValue: Window.height,
                restSpeedThreshold: 100,
                restDisplacementThreshold: 40,
                useNativeDriver: false
            })
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
        zIndex: 10,
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
        zIndex: 20
    },
    draggablePanel: {
        height: '100%',
        borderRadius: 20,
        position: 'relative'
    },
    handleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    handleAura: {
        opacity: .95,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    handle: {
        width: 50,
        height: 7,
        backgroundColor: 'lightgray',
        borderRadius: 50
    }
});

export default SlidingUpPanel;
