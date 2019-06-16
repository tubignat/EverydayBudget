import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, TouchableHighlight, Alert } from 'react-native';

const vh = Dimensions.get('window').height;
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <ScrollView
            bounces={false}
            style={{ marginTop: 50, padding: 20 }}
            contentOffset={{ x: 0, y: 0 }}
            onContentSizeChange={(w, h) => this.setState({ contentHeight: h - vh })}
        >
            <KeyBoard />
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    keyBoard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    keyButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        width: 70,
        marginBottom: 10,
        borderRadius: 100,
        borderWidth: 0,
        borderColor: 'rgb(0, 122, 255)'
    },
    keyButtonText: {
        fontSize: 40,
        color: 'rgb(0, 122, 255)'
    }
});

class KeyBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    render() {
        return <View style={styles.keyBoard}>
            <Text>{this.state.text}</Text>
            <View style={styles.row}>
                <KeyButton text={1} onPress={(txt) => this.setState({ text: this.state.text.concat(txt) })} />
                <KeyButton text={2} onPress={() => this.setState({ text: this.state.text.concat(2) })} />
                <KeyButton text={3} onPress={() => this.setState({ text: this.state.text.concat(3) })} />
            </View>
            <View style={styles.row}>
                <KeyButton text={4} onPress={() => this.setState({ text: this.state.text.concat(4) })} />
                <KeyButton text={5} onPress={() => this.setState({ text: this.state.text.concat(5) })} />
                <KeyButton text={6} onPress={() => this.setState({ text: this.state.text.concat(6) })} />
            </View>
            <View style={styles.row}>
                <KeyButton text={7} onPress={() => this.setState({ text: this.state.text.concat(7) })} />
                <KeyButton text={8} onPress={() => this.setState({ text: this.state.text.concat(8) })} />
                <KeyButton text={9} onPress={() => this.setState({ text: this.state.text.concat(9) })} />
            </View>
            <View style={styles.row}>
                <KeyButton text={'.'} onPress={() => this.setState({ text: this.state.text.concat('.') })} />
                <KeyButton text={0} onPress={() => this.setState({ text: this.state.text.concat(0) })} />
                <KeyButton text={'X'} onPress={() => this.setState({ text: '' })} />
            </View>
        </View>
    }
}

class KeyButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        }
    }

    render() {
        return <View style={[styles.keyButton, this.state.isPressed ? { backgroundColor: 'rgb(0, 122, 255)' } : {}]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => this.setState({ isPressed: true })}
            onResponderRelease={() => {
                this.props.onPress();
                this.setState({ isPressed: false });
            }}
            onResponderTerminate={() => this.setState({ isPressed: false })}
        >
            <Text style={[styles.keyButtonText, this.state.isPressed ? { color: 'white' } : {}]}>{this.props.text}</Text>
        </View >

    }
}