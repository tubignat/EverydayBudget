import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { ScrollView, View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Animated, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from '../components/TextButton';
import Page from '../components/Page'
import { getBudgetPerDay } from "../domain/budget";

@observer
export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { incomesStorage, expensesStorage, monthSetupStorage } = this.props;

        if (!monthSetupStorage.isInitiated)
            return <Page></Page>;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        this.ensureMonthIsSetUp(incomesStorage, expensesStorage, monthSetupStorage, year, month);

        const incomes = incomesStorage.getIncomes(year, month);
        const expenses = expensesStorage.getExpenses(year, month);
        const budgetPerDay = getBudgetPerDay(incomes.map(i => i.amount), expenses.map(e => e.amount), year, month);

        return <Page>
            <KeyboardAvoidingView behavior='padding'>
                <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                    <View style={{ paddingBottom: 130 }}>
                        <Text style={styles.header}>Настройки</Text>
                        <Text style={styles.subheader}>Доходы</Text>

                        <IncomesList
                            incomes={incomes}
                            thereAreNoValuesYetText={'Пока доходов нет. '}
                            onRemove={(id) => incomesStorage.removeIncome(id)}
                            onAmountChanged={(id, amount) => incomesStorage.editIncome(id, amount, null)}
                            onDescriptionChanged={(id, description) => incomesStorage.editIncome(id, null, description)}
                            onAdd={() => incomesStorage.addIncome(year, month, 0, 'Новый доход')}
                        />

                        <Text style={styles.subheader}>Регулярные расходы</Text>

                        <IncomesList
                            incomes={expenses}
                            thereAreNoValuesYetText={'Пока расходов нет. '}
                            onRemove={(id) => expensesStorage.removeExpense(id)}
                            onAmountChanged={(id, amount) => expensesStorage.editExpense(id, amount, null)}
                            onDescriptionChanged={(id, description) => expensesStorage.editExpense(id, null, description)}
                            onAdd={() => expensesStorage.addExpense(year, month, 0, 'Новый расход')}
                        />

                        <View style={styles.budgetPerDayContainer}>
                            <Text style={styles.subheader}>Бюджет на день</Text>
                            <Text style={styles.budgetPerDayAmount}>{budgetPerDay.toFixed(0)} &#8381;</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Page>
    }

    ensureMonthIsSetUp = (incomesStorage, expensesStorage, monthSetupStorage, year, month) => {
        // For migration
        const currentIncomes = incomesStorage.getIncomes(year, month);
        const currentExpenses = expensesStorage.getExpenses(year, month);

        if (currentIncomes.length === 0 && currentExpenses.length === 0 && !monthSetupStorage.isMonthSetUp(year, month)) {
            const previousMonth = this.getPreviousMonth(year, month);

            const incomes = incomesStorage.getIncomes(previousMonth.year, previousMonth.month);
            incomes.forEach(income => incomesStorage.addIncome(year, month, income.amount, income.description));

            const expenses = expensesStorage.getExpenses(previousMonth.year, previousMonth.month);
            expenses.forEach(expense => expensesStorage.addExpense(year, month, expense.amount, expense.description));

            monthSetupStorage.addMonthSetup(year, month);
        }
    }

    getPreviousMonth = (year, month) => month === 0 ? { year: year - 1, month: 11 } : { year: year, month: month - 1 }
}

@observer
class IncomesList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <View style={styles.incomesList}>
            {
                this.props.incomes.length === 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>{this.props.thereAreNoValuesYetText}</Text>
                    <TextButton text='Добавить' height={50} fontSize={15} onPress={this.props.onAdd} />
                </View>
            }
            {
                this.props.incomes.map((i) =>
                    <IncomeView
                        key={i.id}
                        income={i}
                        onRemoveButtonPressed={() => this.props.onRemove(i.id)}
                        onAmountChanged={(amount) => this.props.onAmountChanged(i.id, amount)}
                        onDescriptionChanged={(description) => this.props.onDescriptionChanged(i.id, description)}
                    />
                )
            }
            {
                this.props.incomes.length !== 0 && <View style={styles.addButton}>
                    <TextButton text='Добавить' height={50} fontSize={18} onPress={this.props.onAdd} />
                </View>
            }
        </View>
    }
}

@observer
class IncomeView extends Component {
    constructor(props) {
        super(props);

        const height = 50;

        this.state = {
            fadeAnim: new Animated.Value(0),
            expandAnim: new Animated.Value(0)
        };

        this.textInputRef = React.createRef();

        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 150 }).start();
        Animated.timing(this.state.expandAnim, { toValue: height, duration: 150 }).start();
    }

    render() {
        return <Animated.View style={{
            ...styles.incomeView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <View style={styles.wrapper}>
                <TouchableWithoutFeedback onPress={() => this.textInputRef.focus()}>
                    <View style={styles.incomeViewAmount}>
                        <TextInputWithTemporaryInvalidValue
                            forwardedRef={ref => this.textInputRef = ref}
                            style={styles.incomeViewAmountText}
                            value={this.props.income.amount.toString()}
                            onChange={(text) => this.props.onAmountChanged(Number(text))}
                            placeholder=''
                            isValidValue={(text) => {
                                const number = Number(text);
                                return !isNaN(number) && number !== 0;
                            }}
                        />
                        <Text style={styles.incomeViewAmountText}> &#8381;</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TextInput
                    style={styles.incomeViewText}
                    onChangeText={this.props.onDescriptionChanged}
                    value={this.props.income.description}
                    selectTextOnFocus
                    placeholder='Описание...'
                />
            </View>
            <Animated.View style={{
                ...styles.removeButtonContainer,
                opacity: this.state.fadeAnim,
                transform: [{ scaleX: this.state.fadeAnim }, { scaleY: this.state.fadeAnim }]
            }}>
                <IconButton size={40} innerSize={18} icon='close-circle' color='rgb(255, 69, 58)'
                    onPress={this.onRemove} />
            </Animated.View>
        </Animated.View>
    }

    onRemove = () => {
        Animated.parallel([
            Animated.timing(this.state.expandAnim, { toValue: 0, duration: 200 }),
            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 150 }),
        ])
            .start(this.props.onRemoveButtonPressed)
    }
}


const styles = StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40
    },
    subheader: {
        color: 'gray',
        fontSize: 20,
        marginLeft: 15,
    },
    incomesList: {
        margin: 20,
        marginRight: 0,
        marginBottom: 40,
        flex: 1,
        justifyContent: 'center'
    },
    addButton: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeView: {
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'row',
    },
    emptyListTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row'
    },
    incomeViewText: {
        alignSelf: 'center',
        flex: 1,
        flexGrow: 1.5,
        fontSize: 18,
    },
    incomeViewAmount: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%'
    },
    incomeViewAmountText: {
        fontSize: 18,
    },
    removeButtonContainer: {
        alignSelf: 'center'
    },
    budgetPerDayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    budgetPerDayAmount: {
        fontSize: 22,
        marginRight: 20
    }
});