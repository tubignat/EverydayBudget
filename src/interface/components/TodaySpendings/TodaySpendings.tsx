import React from 'react';
import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { Page } from '../common/Page'
import { SpendingsList } from '../common/Spendings/SpendingsList'
import { observer } from 'mobx-react';
import { ApplicationContext } from '../../ApplicationContext';
import { ColorScheme } from '../../color/ColorScheme';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

function TodaySpendings() {

    const application = React.useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const spendings = application.todaysSpendings;
    const styles = getStyles(application.colorScheme);

    return <Page scheme={application.colorScheme}>
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>{application.locale.todaysExpenses}</Text>
                {
                    spendings.length > 0 && <SpendingsList
                        spendings={spendings}
                        scheme={application.colorScheme}
                        locale={application.locale}
                        currency={application.currency}
                        remove={application.removeSpending}
                        edit={application.editSpending}
                        shouldPlayEnterAnimation={false}
                        shouldFocusAddedSpending={false}
                    />
                }
                {
                    spendings.length == 0 &&
                    <View style={styles.emptyListTextContainer}>
                        <Text style={styles.emptyListText}>{application.locale.noExpensesToday}</Text>
                    </View>
                }
            </View>
        </ScrollView>
    </Page>
}

export default observer(TodaySpendings);

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        paddingHorizontal: isSmallScreen ? 16 : 24,
        paddingTop: isBigScreen ? 72 : 48,
        paddingBottom: 72
    },
    header: {
        fontSize: 36,
        marginBottom: 64,
        color: scheme.primaryText,
        fontWeight: 'bold'
    },
    emptyListText: {
        color: scheme.secondaryText,
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
        borderColor: scheme.secondaryText,
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