
import React, { Component } from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { IconButton } from '../components/IconButton';
import Page from '../components/Page'
import SpendingsList from '../components/SpendingsList'

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

        return <Page>
            <ScrollView style={styles.container}>
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
        </Page>
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20, paddingTop: 45
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
    }
});