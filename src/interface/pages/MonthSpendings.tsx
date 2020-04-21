import React, { useContext } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';

import { Page } from '../components/Page'
import { observer } from 'mobx-react';
import { ApplicationContext } from '../ApplicationContext';
import { ColorScheme } from '../color/ColorScheme';
import { MonthSpendingsTable } from '../components/MonthSpendingsTable/MonthSpendingsTable';

export const MonthSpendings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <Page scheme={application.colorScheme}>
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView style={{ padding: 20, paddingTop: 45 }}>
                <View style={{ paddingBottom: 120 }}>
                    <Text style={styles.header}>{application.locale.statisticsPageTitle}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 230 }}>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <MonthSpendingsTable />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </Page>
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    header: {
        fontSize: 40,
        fontWeight: '300',
        marginBottom: 40,
        color: scheme.primaryText
    }
});