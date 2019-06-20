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


const styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
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
    }

    render() {
        return (
            <Swiper style={styles.wrapper} loop={false} index={2}>
                <View style={styles.slide2}>
                    <Text style={styles.text}>Beautiful</Text>
                </View>
                <Home storage={this.spendingsStorage} />
                <TodaySpendings storage={this.spendingsStorage} />
            </Swiper>
        );
    }
}