import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import Page from '../components/Page'
import SpendingsList from '../components/SpendingsList'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { SpendingId } from '../domain/SpendingsRepository';
import { ApplicationContext } from '../domain/ApplicationContext';

function TodaySpendings() {

    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const spendings = application.todaysSpendings;

    return <Page>
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{application.locale.todaysExpenses}</Text>
            {
                spendings.length > 0 && <SpendingsList spendings={spendings} remove={(id: SpendingId) => application.removeSpending(id)} />
            }
            {
                spendings.length == 0 &&
                <View style={styles.emptyListTextContainer}>
                    <Text style={styles.emptyListText}>{application.locale.noExpensesToday}</Text>
                </View>
            }
        </ScrollView>
    </Page>
}

export default observer(TodaySpendings);

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