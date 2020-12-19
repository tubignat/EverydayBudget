import {observer} from "mobx-react";
import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {ApplicationContext} from '../../../Contexts';
import {ColorScheme} from '../../../color/ColorScheme';
import SlidingUpPanel from "../../common/SlidingUpPanel";
import {BudgetSettings} from "./BudgetSettings";
import {useContextUnsafe} from "../../../Hooks";

const {width, height} = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const FinancesSettingsPanel = observer(({onClose}: { onClose: () => void }) => {
    const application = useContextUnsafe(ApplicationContext);

    const styles = getStyles(application.colorScheme);
    const offset = isBigScreen ? 75 : 50;

    return <SlidingUpPanel colorScheme={application.colorScheme} offsetTop={offset} onClose={onClose}>
        <View style={{paddingBottom: 70, marginHorizontal: isSmallScreen ? -8 : 0}}>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>{application.locale.financesHeader}</Text>
                <Text style={styles.additionalText}>{application.locale.financesDescriptor}</Text>
            </View>

            <BudgetSettings />
        </View>
    </SlidingUpPanel>
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    headerContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isSmallScreen ? 8 : 24,
        marginBottom: 48,
    },
    header: {
        fontSize: isSmallScreen ? 32 : 36,
        fontWeight: 'bold',
        color: scheme.primaryText
    },
    additionalText: {
        fontSize: isSmallScreen ? 16 : 20,
        color: scheme.alternativeSecondaryText,
        fontWeight: 'bold',
        marginTop: 8
    },
    addButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
