import React, {useContext} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Dimensions
} from 'react-native';

import {Page} from '../common/Page'
import {observer} from 'mobx-react';
import {ApplicationContext} from '../../Contexts';
import {ColorScheme} from '../../color/ColorScheme';
import {MonthSpendingsTable} from './MonthSpendingsTable';
import {useContextUnsafe} from "../../Hooks";

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const MonthSpendings = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

    const styles = getStyles(application.colorScheme);

    return <KeyboardAvoidingView behavior='padding'>
        <ScrollView style={styles.pageContent}>
            <View style={{paddingBottom: 120}}>
                <Text style={styles.header}>{application.locale.getMonthName(application.month)}</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: 230}}>
                </View>
                <View style={{marginTop: 20}}>
                    <MonthSpendingsTable/>
                </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    pageContent: {
        paddingHorizontal: 24,
        paddingVertical: isBigScreen ? 72 : 48,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: scheme.primaryText
    }
});
