import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SpendingsList} from '../common/Spendings/SpendingsList'
import {observer} from 'mobx-react';
import {ApplicationContext, DevSettingsContext} from '../../Contexts';
import {ColorScheme} from '../../color/ColorScheme';
import {useContextUnsafe} from "../../Hooks";
import {FeatureFlag} from "../../../domain/repositories/DevSettingsRepository";
import {YandexAd} from "../common/YandexAdBanner";

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

function TodaySpendings() {
    const application = useContextUnsafe(ApplicationContext);
    const devSettings = useContextUnsafe(DevSettingsContext)

    const spendings = application.todaysSpendings;
    const styles = getStyles(application.colorScheme);

    return <ScrollView style={{height: '100%'}}>
        <View style={styles.container}>
            <Text style={styles.header}>{application.locale.todayPageTitle}</Text>
            {
                !devSettings.isFlagEnabled(FeatureFlag.NoAds) && <YandexAd/>
            }
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
}

export default observer(TodaySpendings);

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        paddingHorizontal: isSmallScreen ? 16 : 24,
        paddingTop: isBigScreen ? 72 : 48,
        paddingBottom: 72,
        minHeight: '100%'
    },
    header: {
        fontSize: 36,
        marginBottom: 24,
        color: scheme.primaryText,
        fontWeight: 'bold'
    },
    emptyListText: {
        color: scheme.secondaryText,
        fontSize: 15
    },
    emptyListTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
});
