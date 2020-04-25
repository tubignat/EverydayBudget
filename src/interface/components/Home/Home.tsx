import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { KeyBoard } from './keyboard/Keyboard';
import { AddSpendingButton } from './AddSpendingButton';
import { Page } from '../common/Page'
import { observer } from 'mobx-react';
import { ApplicationContext } from '../../ApplicationContext';
import { ApplicationState } from '../../ApplicationState';
import { formatMoney } from '../../NumberFormat';
import { ColorScheme } from '../../color/ColorScheme';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

interface IHomeState {
    newTransactionRubles: number,
    newTransactionKopecks: number[],
    isKopeckMode: boolean
}

@observer
export default class Home extends Component<{}, IHomeState> {

    static contextType = ApplicationContext;

    context !: ApplicationState;

    constructor(props: {}) {
        super(props);
        this.state = {
            newTransactionRubles: 0,
            newTransactionKopecks: [],
            isKopeckMode: false
        };
    }

    render() {
        const { newTransactionRubles, isKopeckMode, newTransactionKopecks } = this.state;
        const { currency, locale, todaysLimit, todaysDelta, colorScheme }: ApplicationState = this.context;

        const styles = getStyles(colorScheme);

        return <Page scheme={colorScheme}>
            {
                isBigScreen && <View style={styles.headerContainer}>
                    <Text style={styles.header}>
                        {locale.homePageTitle}
                    </Text>
                </View>
            }
            <View style={styles.keyboardGroupContainer}>

                <View style={styles.budgetContainer}>
                    <Text style={styles.budgetText}>
                        {locale.todaysLimit}
                    </Text>
                    <Text style={{ ...styles.budget, color: todaysLimit < 0 ? colorScheme.danger : colorScheme.primaryText }}>
                        {formatMoney(todaysLimit)} {currency}
                    </Text>
                    <View style={styles.delta}>
                        <Text style={{ ...styles.deltaAmount, color: todaysDelta < 0 ? colorScheme.danger : colorScheme.success }}>
                            {todaysDelta > 0 ? '+' : ''}{formatMoney(todaysDelta)} {currency}
                        </Text>
                        <Text style={styles.deltaLabel}>  {locale.today} </Text>
                    </View>
                </View>

                <View style={styles.addTransactionContainer}>
                    <Text style={styles.addTransactionText}>{locale.addExpense}</Text>
                    <View style={styles.addTransactionInput}>
                        <Text style={styles.transaction}>
                            {formatMoney(newTransactionRubles)}{isKopeckMode ? '.' : ''}{isKopeckMode ? newTransactionKopecks.join('') : ''} {currency}
                        </Text>
                        <AddSpendingButton
                            onPress={this.onAddButtonPressed}
                            disabled={newTransactionRubles === 0 && newTransactionKopecks.length !== 2}
                            scheme={colorScheme}
                        />
                    </View>
                </View>

                <KeyBoard onKeyPressed={this.handleKeyPressed} onRemoveKeyPressed={this.handleRemoveKeyPressed} color={colorScheme.primary} />

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

        const date = new Date();
        this.context.addSpending(this.context.day, amount, date.getHours(), date.getMinutes());

        this.setState({ newTransactionRubles: 0, isKopeckMode: false, newTransactionKopecks: [] });
    }
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    budgetText: {
        color: scheme.secondaryText,
        marginBottom: 10,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: scheme.primaryText
    },
    budgetContainer: {
        marginLeft: 20,
        marginBottom: 40,
    },
    budget: {
        fontSize: isSmallScreen ? 40 : 50,
        marginLeft: 10,
        fontWeight: '200'
    },
    addTransactionContainer: {
        marginLeft: 30,
        marginBottom: isSmallScreen ? 10 : 20
    },
    addTransactionText: {
        color: scheme.secondaryText,
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
        fontWeight: '200',
        color: scheme.primaryText
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
    headerContainer: {
        paddingLeft: 24,
        paddingTop: 72,
        height: '100%',
    },
    delta: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
        marginTop: 5
    },
    deltaLabel: {
        color: scheme.secondaryText,
        fontSize: 15,
    },
    deltaAmount: {
        fontSize: 18,
    }
});