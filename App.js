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
    }

    render() {
        return (
            <Swiper loop={false} index={3} bounces={true} scrollEnabled={!this.state.isScrollLocked}
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