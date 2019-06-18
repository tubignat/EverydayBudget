import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import { KeyBoard } from '../components/keyboard/Keyboard';
import { AddSpendingButton } from '../components/AddSpendingButton';
import { observer } from 'mobx-react';
import { getSaldo, getBudgetPerDay } from '../domain/budget';

const vh = Dimensions.get('window').height;

@observer
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: 0,
            isKopeckMode: false
        };
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const todaysBudget = this.props.storage.todaysBudget.toFixed(0);

        return <ScrollView
            bounces={false}
            style={{ marginTop: 25, padding: 20 }}
            contentOffset={{ x: 0, y: 0 }}
            onContentSizeChange={(w, h) => this.setState({ contentHeight: h - vh })}
        >
            <View style={styles.budgetContainer}>
                <Text style={styles.budgetText}>Бюджет на сегодня</Text>
                <Text style={[styles.budget, { color: todaysBudget < 0 ? 'rgb(255, 69, 58)' : 'black' }]}>{todaysBudget} &#8381;</Text>
            </View>
            <View style={styles.addTransactionContainer}>
                <Text style={styles.addTransactionText}>Добавить трату</Text>
                <View style={styles.addTransactionInput}>
                    <Text style={[styles.transaction, {}]}>
                        {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks : ''} &#8381;
                    </Text>
                    <AddSpendingButton onPress={this.onAddButtonPressed} disabled={newTransactionRubles === 0 && newTransactionKopecks === 0} />
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
            const amount = newTransactionRubles <= 999 ? Number(newTransactionRubles.toString().concat(char)) : newTransactionRubles;
            this.setState({ newTransactionRubles: amount });
        }
    }

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: 0 });
    }

    onAddButtonPressed = () => {
        if (this.state.newTransactionRubles !== 0 || this.state.newTransactionKopecks !== 0) {
            const date = new Date();
            const amount = this.state.newTransactionRubles + (this.state.newTransactionKopecks / 100);
            this.props.storage.addSpending(date.getFullYear(), date.getMonth(), date.getDate(), amount)
            this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: 0 });
        }
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
    addTransactionButton: {
        fontSize: 45,
    },
    transaction: {
        fontSize: 45,
        fontWeight: '200'
    }
});