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


const styles = StyleSheet.create({
    wrapper: {
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.spendingsStorage = new SpendingsStorage();
        this.incomesStorage = new IncomesStorage();
        this.expensesStorage = new ExpensesStorage();
    }

    render() {
        return (
            <Swiper style={styles.wrapper} loop={false} index={0} bounces={true}>
                <Settings incomesStorage={this.incomesStorage} expensesStorage={this.expensesStorage} />
                <Home spendingsStorage={this.spendingsStorage} incomesStorage={this.incomesStorage} expensesStorage={this.expensesStorage} />
                <TodaySpendings storage={this.spendingsStorage} />
            </Swiper>
        );
    }
}