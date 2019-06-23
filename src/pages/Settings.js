
import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, Alert } from 'react-native';
import { observer } from 'mobx-react';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';

@observer
export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { incomesStorage } = this.props;
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const incomes = incomesStorage.getIncomes(year, month);

        return <ScrollView style={{ marginTop: 25, padding: 20 }}>
            <Text style={styles.header}>Настройки</Text>
            <Text style={styles.subheader}>Доходы</Text>

            <IncomesList
                incomes={incomes}
                onRemove={(id) => incomesStorage.removeIncome(id)}
                onAmountChanged={(id, amount) => incomesStorage.editIncome(id, amount, null)}
                onDescriptionChanged={(id, description) => incomesStorage.editIncome(id, null, description)}
            />
            <Text style={styles.subheader}>Регулярные расходы</Text>
        </ScrollView>
    }
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
        </View>
    }
}

@observer
class IncomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <View style={styles.incomeView}>
            <View style={styles.wrapper}>
                <View style={styles.incomeViewAmount}>
                    <TextInputWithTemporaryInvalidValue
                        style={styles.incomeViewAmountText}
                        value={this.props.income.amount.toString()}
                        onChange={(text) => this.props.onAmountChanged(Number(text))}
                        isValidValue={(text) => {
                            const number = Number(text);
                            return !isNaN(number) && number !== 0;
                        }}
                    />
                    <Text style={styles.incomeViewAmountText}> &#8381;</Text>
                </View>
                <TextInput
                    style={styles.incomeViewText}
                    onChangeText={this.props.onDescriptionChanged}
                    value={this.props.income.description}
                />
            </View>
            <View style={styles.removeButtonContainer}>
                <IconButton size={40} innerSize={18} icon='close-circle' onPress={this.props.onRemoveButtonPressed} />
            </View>
        </View>
    }

    handleAmountChanged = (newAmountText) => {
        console.log('amounttext: ' + newAmountText);
        if (newAmountText === '') {
            this.props.onAmountChanged(0);
            console.log('amounttext: ' + newAmountText);
        }
        else {
            const amount = Number(newAmountText);
            if (!isNaN(amount))
                this.props.onAmountChanged(amount);
        }
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
        marginBottom: 10
    },
    incomesList: {
        margin: 20,
        marginRight: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    incomeView: {
        flex: 1,
        paddingBottom: 10,
        flexBasis: 'auto',
        flexDirection: 'row',
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
    },
    incomeViewAmountText: {
        fontSize: 18,
    },
    removeButtonContainer: {
        alignSelf: 'center'
    }
});