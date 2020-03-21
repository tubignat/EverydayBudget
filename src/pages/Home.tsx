import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { KeyBoard } from '../components/keyboard/Keyboard';
import { AddSpendingButton } from '../components/AddSpendingButton';
import Page from '../components/Page'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { Application } from '../domain/Application';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface IHomeProps {
    application: Application
}

interface IHomeState {
    newTransactionRubles: number,
    newTransactionKopecks: number[],
    isKopeckMode: boolean
}

@observer
export default class Home extends Component<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: [],
            isKopeckMode: false
        };
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const { application } = this.props;
        const todaysLimit = application.todaysLimit;

        return <Page>
            {
                isBigScreen && <View style={styles.todaysBudgetContainer}>
                    <Text style={styles.header}>Главная</Text>
                </View>
            }
            <View style={styles.keyboardGroupContainer}>

                <View style={styles.budgetContainer}>
                    <Text style={styles.budgetText}>Бюджет на сегодня</Text>
                    <Text style={{ ...styles.budget, color: todaysLimit < 0 ? 'rgb(255, 69, 58)' : 'black' }}>
                        {todaysLimit.toFixed(0)} &#8381;
                    </Text>
                </View>

                <View style={styles.addTransactionContainer}>
                    <Text style={styles.addTransactionText}>Добавить трату</Text>
                    <View style={styles.addTransactionInput}>
                        <Text style={styles.transaction}>
                            {newTransactionRubles}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks.join('') : ''} &#8381;
                        </Text>
                        <AddSpendingButton
                            onPress={this.onAddButtonPressed}
                            disabled={newTransactionRubles === 0 && newTransactionKopecks.length !== 2}
                        />
                    </View>
                </View>

                <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} />

            </View>
        </Page>
    }

    handleKeyPressed = (char: string) => {
        const { isKopeckMode, newTransactionRubles, newTransactionKopecks } = this.state;

        if (char === '.') {
            this.setState({ isKopeckMode: true })

        } else {
            const updatedRubles = isKopeckMode || newTransactionRubles > 9999
                ? newTransactionRubles
                : Number(newTransactionRubles.toString().concat(char));

            const updatedKopecks = !isKopeckMode || newTransactionKopecks.length === 2 || (newTransactionKopecks[0] === 0 && Number(char) === 0)
                ? newTransactionKopecks
                : newTransactionKopecks.concat(Number(char));

            this.setState({ newTransactionRubles: updatedRubles, newTransactionKopecks: updatedKopecks });
        }
    };

    handleRemoveKeyPressed = () => {
        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    };

    onAddButtonPressed = () => {
        const kopecks = Number(this.state.newTransactionKopecks.join(''));
        const amount = this.state.newTransactionRubles + (kopecks / 100);

        this.props.application.addSpending(this.props.application.day, amount);

        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    }
}

const styles = StyleSheet.create({
    budgetText: {
        color: 'gray',
        marginBottom: 10,
    },
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40
    },
    budgetContainer: {
        marginLeft: 20,
        marginBottom: 30,
    },
    budget: {
        fontSize: isSmallScreen ? 40 : 60,
        marginLeft: 10,
        fontWeight: '200'
    },
    addTransactionContainer: {
        marginLeft: 30,
        marginBottom: isSmallScreen ? 10 : 20
    },
    addTransactionText: {
        color: 'gray',
        marginBottom: isSmallScreen ? 0 : 10
    },
    addTransactionInput: {
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
        fontSize: isSmallScreen ? 30 : 40,
        fontWeight: '200'
    },
    keyboardGroupContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        marginBottom: 50,
        height: isSmallScreen ? 485 : 'auto',
        paddingRight: isSmallScreen ? 0 : 15,
        paddingLeft: isSmallScreen ? 0 : 15
    },
    todaysBudgetContainer: {
        paddingTop: isSmallScreen ? 30 : 45,
        padding: isSmallScreen ? 15 : 20,
        height: '100%',
    }
});