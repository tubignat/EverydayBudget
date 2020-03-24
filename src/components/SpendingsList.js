import React, { Component } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { IconButton } from '../components/IconButton';
import { ApplicationContext } from '../domain/ApplicationContext';

function SpendingsList({ spendings, remove }) {
    const { locale, currency } = React.useContext(ApplicationContext);
    const total = spendings.map(s => s.amount).reduce((sum, nextAmount) => sum += nextAmount);
    return <View>
        {
            spendings.map(s => <SpendingView key={s.id} amount={s.amount} onRemoveButtonPressed={() => remove(s.id)} />)
        }
        <View style={styles.border} />
        <View style={styles.totalContainer}>
            <Text style={[styles.total, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>{total % 1 === 0 ? total : total.toFixed(2)} {currency}</Text>
            <Text style={[styles.totalText, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>{locale.totalExpensesToday}</Text>
        </View>
        <View style={styles.placeholder}></View>
    </View>
}

class SpendingView extends Component {

    static contextType = ApplicationContext;

    constructor(props) {
        super(props);

        const height = 80;

        this.state = {
            fadeAnim: new Animated.Value(0),
            expandAnim: new Animated.Value(0)
        };

        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 150 }).start();
        Animated.timing(this.state.expandAnim, { toValue: height, duration: 150 }).start();
    }

    render() {

        const { currency } = this.context;

        return <Animated.View style={{
            ...styles.spendingView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <Text style={styles.spendingViewText}>{this.props.amount % 1 === 0 ? this.props.amount : this.props.amount.toFixed(2)} {currency}</Text>
            <IconButton size={40} innerSize={20} icon={'close-circle'} color='rgb(255, 69, 58)' onPress={this.onRemove} />
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
    border: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginLeft: 20,
        marginRight: 20
    },
    totalContainer: {
        padding: 20,
        paddingRight: 15,
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
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spendingViewText: {
        fontSize: 30,
        fontWeight: '200'
    },
});

export default SpendingsList;