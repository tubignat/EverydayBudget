import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Home from './src/pages/Home';
import TodaySpendings from './src/pages/TodaySpendings';
import { observer } from 'mobx-react';
import { SpendingsStorage } from './src/domain/spending';
import { IncomesStorage } from './src/domain/income';
import { ExpensesStorage } from './src/domain/expense';
import Settings from './src/pages/Settings.js';
import MonthSpendings from './src/pages/MonthSpendings';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScrollLocked: false
        };
        this.spendingsStorage = new SpendingsStorage();
        this.incomesStorage = new IncomesStorage();
        this.expensesStorage = new ExpensesStorage();

        // setUpTestData(this.spendingsStorage, this.incomesStorage, this.expensesStorage)
    }

    render() {
        return (
            <Swiper loop={false} index={1} bounces={true} scrollEnabled={!this.state.isScrollLocked}
                showsPagination={!this.state.isScrollLocked}>
                <Settings incomesStorage={this.incomesStorage} expensesStorage={this.expensesStorage} />
                <Home spendingsStorage={this.spendingsStorage} incomesStorage={this.incomesStorage} expensesStorage={this.expensesStorage} />
                <TodaySpendings storage={this.spendingsStorage} />
                <MonthSpendings spendingsStorage={this.spendingsStorage} incomesStorage={this.incomesStorage}
                    expensesStorage={this.expensesStorage}
                    onModalOpen={() => this.setState({ isScrollLocked: true })}
                    onModalClose={() => this.setState({ isScrollLocked: false })}
                />
            </Swiper>
        );
    }
}

function setUpTestData(spendingsStorage, incomesStorage, expensesStorage) {

    const date = new Date();

    incomesStorage.addIncome(date.getFullYear(), date.getMonth(), 200, "Зарплата");
    incomesStorage.addIncome(date.getFullYear(), date.getMonth(), 15000, "Pension");
    incomesStorage.addIncome(date.getFullYear(), date.getMonth(), 16000, "Bonus");
    incomesStorage.addIncome(date.getFullYear(), date.getMonth(), 15000, "Outside income");
    incomesStorage.addIncome(date.getFullYear(), date.getMonth(), 15000, "Very long named income, what is going to happen with layout?");

    expensesStorage.addExpense(date.getFullYear(), date.getMonth(), 15400, 'Кредит')

    const spendings = getTestSpendings(date.getFullYear(), date.getMonth(), date.getDate());

    spendings.forEach(s => spendingsStorage.addSpending(s.year, s.month, s.day, s.amount, s.description))
}

function getTestSpendings(year, month, day) {
    return [
        { year: year, month: month, day: day, amount: 500 },
        { year: year, month: month, day: day, amount: 2300 },
        { year: year, month: month, day: day, amount: 2450 },
        { year: year, month: month, day: day, amount: 100 },
    ]
};