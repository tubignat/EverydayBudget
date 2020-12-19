import {observer} from "mobx-react";
import React, {useMemo} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import ColorSchemeSelector from './ColorSchemeSelector';
import {ColorScheme} from "../../../color/ColorScheme";
import {ApplicationContext, DevSettingsContext} from "../../../Contexts";
import {DeviceState} from "../../../DeviceState";
import {useContextUnsafe} from "../../../Hooks";
import {FeatureFlag} from "../../../../domain/repositories/DevSettingsRepository";
import {TextButton} from "../../common/TextButton";
import {CategoriesSettingsPanel} from "../CategoriesSettings/CategoriesSettingsPanel";
import {ModalStackState} from "../../../ModalStackState";
import {DevSettingsPanel} from "./DevSettingsPanel";

export const UserPreferencesSettings = observer(() => {
    const application = useContextUnsafe(ApplicationContext);
    const devSettings = useContextUnsafe(DevSettingsContext);

    const onPress = useMemo(createMultipleClickHandler, [])

    const styles = getStyles(application.colorScheme);

    const renderModal = (onClose: () => void) => <DevSettingsPanel key='devSettings' onClose={onClose}/>

    return <View style={styles.container}>
        <View style={styles.inlineSettingContainer}>
            <Text style={styles.subheader}>{application.locale.currency}</Text>
            <CurrencySelector currency={application.currency} onChange={application.changeCurrency} scheme={application.colorScheme}/>
        </View>

        <View style={styles.inlineSettingContainer}>
            <Text style={styles.subheader}>{application.locale.language}</Text>
            <LanguageSelector language={application.language} onChange={application.changeLanguage} scheme={application.colorScheme}/>
        </View>

        <View style={[styles.inlineSettingContainer, styles.appearanceSettingContainer]}>
            <Text style={styles.subheader} onPress={onPress}>
                {application.locale.appearance}
            </Text>
            <ColorSchemeSelector
                preference={application.colorSchemePreference}
                onChange={application.changeColorSchemePreference}
                scheme={application.colorScheme}
            />
        </View>

        {
            devSettings.devMenuVisible && <View style={[styles.inlineSettingContainer, styles.appearanceSettingContainer]}>
                <Text style={styles.subheader}>Dev Tools</Text>
                <TextButton height={24} disabled={false} fontSize={20} scheme={application.colorScheme} text='open'
                            onPress={() => ModalStackState.open(renderModal)}
                />
            </View>
        }
    </View>

    function createMultipleClickHandler() {
        let timesClicked = 0
        let lastTimeClicked = 0

        return () => {
            const timeOfClick = new Date().getTime()
            if (timesClicked === 0 || timeOfClick - lastTimeClicked < 500) {
                timesClicked++
            } else {
                timesClicked = 0
            }

            lastTimeClicked = timeOfClick

            if (timesClicked > 10) {
                timesClicked = 0
                devSettings.switchDevMenuVisibility()
                Alert.alert("Dev tools", `Dev tools are ${devSettings.devMenuVisible ? "enabled" : "disabled"}`)
            }
        }
    }
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
        flexDirection: DeviceState.screenSize === 'S' ? 'column' : 'row',
        alignItems: DeviceState.screenSize === 'S' ? 'flex-start' : 'center',
        height: DeviceState.screenSize === 'S' ? 88 : 32
    }
})
