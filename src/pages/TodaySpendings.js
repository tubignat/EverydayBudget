
import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { IconButton } from '../components/IconButton';

@observer
export default class TodaySpendings extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { storage } = this.props;
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const spendings = storage.getSpendings(year, month, day);

        return <ScrollView style={styles.container}>
            <Text style={styles.header}>Траты за сегодня</Text>
            {
                spendings.length > 0 && <SpendingsList spendings={spendings} remove={(id) => storage.removeSpending(id)} />
            }
            {
                spendings.length == 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>За сегодня трат пока нет</Text>
                </View>
            }
        </ScrollView>
    }
}

class SpendingsList extends Component {
    render() {
        const total = this.props.spendings.map(s => s.amount).reduce((sum, nextAmount) => sum += nextAmount);
        return <View>
            {
                this.props.spendings.map(s => <SpendingView key={s.id} amount={s.amount} onRemoveButtonPressed={() => this.props.remove(s.id)} />)
            }
            <View style={styles.border} />
            <View style={styles.totalContainer}>
                <Text style={[styles.total, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>{total % 1 === 0 ? total : total.toFixed(2)} &#8381;</Text>
                <Text style={[styles.totalText, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>потрачено</Text>
            </View>
            <View style={styles.placeholder}></View>
        </View>
    }
}

class SpendingView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <View style={styles.spendingView}>
            <Text style={styles.spendingViewText}>{this.props.amount % 1 === 0 ? this.props.amount : this.props.amount.toFixed(2)} &#8381;</Text>
            <IconButton size={40} innerSize={20} icon={'close-circle'} color='rgb(255, 69, 58)' onPress={this.props.onRemoveButtonPressed} />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        padding: 20
    },
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40
    },
    emptyListText: {
        color: 'gray',
        fontSize: 15
    },
    emptyListTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get("screen").height - 250
    },
    border: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginLeft: 20,
        marginRight: 20
    },
    totalContainer: {
        padding: 20,
        paddingRight: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    total: {
        fontSize: 30,
    },
    totalText: {
        fontSize: 30,
        fontWeight: '300',
    },
    placeholder: {
        height: 100
    },
    spendingView: {
        padding: 20,
        paddingRight: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spendingViewText: {
        fontSize: 30,
        fontWeight: '200'
    },
});