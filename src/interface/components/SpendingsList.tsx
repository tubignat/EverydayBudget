import React, { Component } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { IconButton } from './IconButton';
import { ApplicationContext } from '../ApplicationContext';
import { formatMoney } from '../NumberFormat';
import { Spending, SpendingId } from '../../domain/repositories/SpendingsRepository';
import { ApplicationState } from '../ApplicationState';
import { ColorScheme } from '../color/ColorScheme';

function SpendingsList({ spendings, remove }: { spendings: Spending[], remove: (id: SpendingId) => void }) {
    const application: ApplicationState | undefined = React.useContext(ApplicationContext);
    if (!application)
        return null;

    const styles = getStyles(application.colorScheme);

    const total = spendings.map(s => s.amount).reduce((sum, nextAmount) => sum += nextAmount);

    return <View>
        {
            spendings.map(s => <SpendingView key={s.id} amount={s.amount} onRemoveButtonPressed={() => remove(s.id)} scheme={application.colorScheme} />)
        }
        <View style={styles.border} />
        <View style={styles.totalContainer}>
            <Text style={[styles.total, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>{formatMoney(total)} {application.currency}</Text>
            <Text style={[styles.totalText, { fontSize: total % 1 !== 0 && total >= 10000 ? 28 : 30 }]}>{application.locale.totalExpensesToday}</Text>
        </View>
        <View style={styles.placeholder}></View>
    </View>
}

interface ISpendingViewProps {
    amount: number
    onRemoveButtonPressed: () => void
    scheme: ColorScheme
}

interface ISpendingViewState {
    fadeAnim: Animated.Value
    expandAnim: Animated.Value
}

class SpendingView extends Component<ISpendingViewProps, ISpendingViewState> {

    static contextType = ApplicationContext;
    context !: ApplicationState;

    constructor(props: ISpendingViewProps) {
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
        const { currency, colorScheme } = this.context;
        const styles = getStyles(colorScheme);

        return <Animated.View style={{
            ...styles.spendingView,
            height: this.state.expandAnim,
            opacity: this.state.fadeAnim
        }}>
            <Text style={styles.spendingViewText}>{formatMoney(this.props.amount)} {currency}</Text>
            <IconButton size={40} innerSize={20} icon={'close-circle'} color={this.props.scheme.danger} onPress={this.onRemove} />
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

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    border: {
        borderBottomWidth: 1,
        borderColor: scheme.secondaryText,
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
        color: scheme.primaryText
    },
    totalText: {
        fontSize: 30,
        fontWeight: '300',
        color: scheme.primaryText
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
        fontWeight: '200',
        color: scheme.primaryText
    },
});

export default SpendingsList;