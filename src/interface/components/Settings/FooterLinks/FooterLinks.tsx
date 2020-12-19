import React, { useContext } from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { ApplicationContext } from "../../../Contexts";
import { ColorScheme } from '../../../color/ColorScheme';
import {useContextUnsafe} from "../../../Hooks";

export function FooterLinks() {
    const application = useContextUnsafe(ApplicationContext);

    const styles = getStyles(application.colorScheme);

    return <View style={styles.linksContainer}>
        <Text style={styles.link} onPress={() => Linking.openURL(application.locale.websiteURL)}>
            {application.locale.website}
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://everydaybudget.app/policy')}>
            {application.locale.privacyPolicy}
        </Text>
    </View>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    linksContainer: {
        marginTop: 40,
    },
    link: {
        fontSize: 15,
        color: scheme.secondaryText,
        textDecorationLine: 'underline',
        paddingTop: 10,
        paddingBottom: 10,
    },
})
