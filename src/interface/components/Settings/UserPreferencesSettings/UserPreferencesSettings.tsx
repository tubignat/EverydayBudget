import { observer } from "mobx-react";
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import ColorSchemeSelector from './ColorSchemeSelector';
import { ColorScheme } from "../../../color/ColorScheme";
import { ApplicationContext } from "../../../ApplicationContext";

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const UserPreferencesSettings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <View style={styles.container}>
        <View style={styles.inlineSettingContainer}>
            <Text style={styles.subheader}>{application.locale.currency}</Text>
            <CurrencySelector currency={application.currency} onChange={application.changeCurrency} scheme={application.colorScheme} />
        </View>

        <View style={styles.inlineSettingContainer}>
            <Text style={styles.subheader}>{application.locale.language}</Text>
            <LanguageSelector language={application.language} onChange={application.changeLanguage} scheme={application.colorScheme} />
        </View>

        <View style={[styles.inlineSettingContainer, styles.appearanceSettingContainer]}>
            <Text style={styles.subheader}>{application.locale.appearance}</Text>
            <ColorSchemeSelector
                preference={application.colorSchemePreference}
                onChange={application.changeColorSchemePreference}
                scheme={application.colorScheme}
            />
        </View>
    </View>

})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        marginTop: 40
    },
    subheader: {
        color: scheme.secondaryText,
        fontSize: 20,
    },
    inlineSettingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        height: 32,
    },
    appearanceSettingContainer: {
        marginTop: 32,
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: isSmallScreen ? 'flex-start' : 'center',
        height: isSmallScreen ? 88 : 32
    }
})