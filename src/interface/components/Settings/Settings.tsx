import React, { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Page } from '../common/Page'
import { observer } from 'mobx-react';
import { ApplicationContext } from '../../ApplicationContext';
import { ColorScheme } from '../../color/ColorScheme';
import { StartOfPeriodSettings } from './StartOfPeriodSettings/StartOfPeriodSettings';
import { BudgetSettings } from './BudgetSettings/BudgetSettings';
import { UserPreferencesSettings } from './UserPreferencesSettings/UserPreferencesSettings';
import { FooterLinks } from './FooterLinks/FooterLinks';
import { CategoriesSettings } from './CategoriesSettings/CategoriesSettings';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

const Settings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <Page scheme={application.colorScheme}>
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView style={styles.pageContainer}>
                <View style={{ paddingBottom: 130 }}>
                    <Text style={styles.header}>{application.locale.settingsPageTitle}</Text>
                    <View style={styles.pageContent}>
                        <BudgetSettings />
                        <StartOfPeriodSettings />
                        <CategoriesSettings />
                        <UserPreferencesSettings />
                        <FooterLinks />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </Page>
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    pageContainer: {
        paddingLeft: 24,
        paddingRight: isSmallScreen ? 12 : 24,
        paddingVertical: isBigScreen ? 72 : 48,
    },
    pageContent: {
        paddingHorizontal: isBigScreen ? 16 : 0
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        height: 48,
        marginBottom: 48,
        color: scheme.primaryText,
    },
})

export default Settings;