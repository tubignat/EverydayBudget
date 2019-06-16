import React, { Component } from 'react';
import { IconOutline, IconFill } from '@ant-design/icons-react-native';
import { Font } from 'expo';
import { ScrollView, View, Text, Dimensions, StyleSheet, TouchableHighlight, Alert } from 'react-native';

const vh = Dimensions.get('window').height;
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: 0,
            isKopeckMode: false,
            todaysBudget: 1500
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'antoutline': require('../../node_modules/@ant-design/icons-react-native/fonts/antoutline.ttf')
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        const { newTransactionRubles, todaysBudget, isKopeckMode, newTransactionKopecks } = this.state;

        return <ScrollView
            bounces={false}
            style={{ marginTop: 25, padding: 20 }}
            contentOffset={{ x: 0, y: 0 }}
            onContentSizeChange={(w, h) => this.setState({ contentHeight: h - vh })}
        >
            <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>Бюджет на сегодня</Text>
                <Text style={styles.budget}>{todaysBudget}</Text>
            </View>
            <View style={styles.addTransactionContainer}>
                <Text style={styles.addTransactionText}>Добавить</Text>
                <View style={styles.addTransactionInput}>
                    <Text style={[styles.transaction, {}]}>
                        {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks : ''} &#8381;
                    </Text>
                    {
                        this.state.fontLoaded &&
                        <IconOutline style={[styles.addTransactionButton, { color: newTransactionRubles === 0 ? 'lightgray' : 'rgb(48, 209, 88)' }]} name='check-circle' />

                    }
                </View>
            </View>
            <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} />
        </ScrollView>
    }

    handleKeyPressed = (char) => {
        const { isKopeckMode, newTransactionRubles, newTransactionKopecks } = this.state;

        if (char === '.') {
            this.setState({ isKopeckMode: true })
        } else if (isKopeckMode) {
            const amount = newTransactionKopecks <= 10 ? Number(newTransactionKopecks.toString().concat(char)) : newTransactionKopecks;
            this.setState({ newTransactionKopecks: amount });
        }
        else {
            const amount = newTransactionRubles <= 99999 ? Number(newTransactionRubles.toString().concat(char)) : newTransactionRubles;
            this.setState({ newTransactionRubles: amount });
        }
    }

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: 0 });
    }
}

const styles = StyleSheet.create({
    budgetText: {
        color: 'gray',
        marginBottom: 10,
    },
    budgetContainer: {
        marginLeft: 15,
        marginBottom: 30
    },
    budget: {
        fontSize: 60,
        marginLeft: 10,
        fontWeight: '200'
    },
    addTransactionContainer: {
        marginLeft: 20,
        marginBottom: 30
    },
    addTransactionText: {
        color: 'gray',
        marginBottom: 10
    },
    addTransactionInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 30,
        height: 60
    },
    transaction: {
        fontSize: 45,
        fontWeight: '200'
    },
    addTransactionButton: {
        fontSize: 45,
    },
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
        borderColor: 'rgb(0, 122, 255)'
    },
    keyButtonText: {
        fontSize: 40
    },
    removeKey: {
        fontSize: 40,
        color: 'rgb(230, 69, 58)'
    }
});

class KeyBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'antfill': require('../../node_modules/@ant-design/icons-react-native/fonts/antfill.ttf')
        });
        this.setState({ fontLoaded: true })
    }

    render() {
        return <View style={styles.keyBoard}>
            <View style={styles.row}>
                <KeyButton text={1} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(1)} />
                <KeyButton text={2} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(2)} />
                <KeyButton text={3} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(3)} />
            </View>
            <View style={styles.row}>
                <KeyButton text={4} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(4)} />
                <KeyButton text={5} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(5)} />
                <KeyButton text={6} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(6)} />
            </View>
            <View style={styles.row}>
                <KeyButton text={7} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(7)} />
                <KeyButton text={8} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(8)} />
                <KeyButton text={9} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(9)} />
            </View>
            <View style={styles.row}>
                <KeyButton text={'.'} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed('.')} />
                <KeyButton text={0} color='rgb(90, 200, 250)' onPress={() => this.props.onKeyPressed(0)} />
                <KeyButton text={this.state.fontLoaded && <IconFill style={styles.removeKey} name='close-circle' />} color='rgb(230, 59, 48)' onPress={this.props.onRemoveKeyPressed} />
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
        return <View style={[styles.keyButton, this.state.isPressed ? { backgroundColor: this.props.color } : {}]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => this.setState({ isPressed: true })}
            onResponderRelease={() => {
                this.props.onPress();
                this.setState({ isPressed: false });
            }}
            onResponderTerminate={() => this.setState({ isPressed: false })}
        >
            <Text style={[styles.keyButtonText, this.state.isPressed ? { color: 'white' } : { color: this.props.color }]}>{this.props.text}</Text>
        </View>
    }
}