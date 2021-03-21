import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Alert, AsyncStorage, NativeModules, StyleSheet, Text, View} from 'react-native';
import {ApplicationContext, DevSettingsContext} from '../../../Contexts';
import {ColorScheme} from '../../../color/ColorScheme';
import SlidingUpPanel from "../../common/SlidingUpPanel";
import {useContextUnsafe} from "../../../Hooks";
import {DeviceState} from "../../../DeviceState";
import {Switch} from "@ant-design/react-native";
import {TextButton} from "../../common/TextButton";
import {Gap} from "../../common/Gap";
import "../../common/YandexAdBanner"
import YandexAd from "../../common/YandexAdBanner";

export const DevSettingsPanel = observer(({onClose}: { onClose: () => void }) => {
    const application = useContextUnsafe(ApplicationContext)
    const devSettings = useContextUnsafe(DevSettingsContext)

    const styles = getStyles(application.colorScheme);
    const offset = DeviceState.screenSize === 'L' ? 75 : 50;

    return <SlidingUpPanel colorScheme={application.colorScheme} offsetTop={offset} onClose={onClose}>
        <View style={{paddingBottom: 70, marginHorizontal: DeviceState.screenSize === 'S' ? -8 : 0}}>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>Dev Tools</Text>
                <Text style={styles.additionalText}>Developer settings</Text>
            </View>

            <Text style={styles.subheader}>Feature flags</Text>
            <View style={{paddingHorizontal: 16}}>
                {
                    devSettings.allFeatureFlags().map(flag =>
                        <View key={flag.name} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={styles.flagLabel}>{flag.name}</Text>
                            <Switch
                                checked={devSettings.isFlagEnabled(flag.value)}
                                onChange={() => {
                                    devSettings.switchFeatureFlag(flag.value)
                                }}
                            />
                        </View>
                    )
                }
            </View>

            <Gap size={24}/>

            <TestDataSettings/>
        </View>
    </SlidingUpPanel>
});

const TestDataSettings = observer(() => {
    const app = useContextUnsafe(ApplicationContext)
    const devSettings = useContextUnsafe(DevSettingsContext)

    const [isClearingData, setIsClearingData] = useState(false)

    const styles = getStyles(app.colorScheme);
    return <View>
        <Text style={styles.subheader}>Fill test data</Text>
        <View style={{paddingHorizontal: 16}}>
            <TextButton
                height={48}
                disabled={false}
                fontSize={16}
                scheme={app.colorScheme}
                text='Fill test data Russian / RUB'
                onPress={() => showAlert('Fill in test data?', () => {
                    devSettings.testDataProvider.fillTestDataRussian(app.year, app.month, app.day)
                    app.init()
                })}
            />
            <TextButton
                height={48}
                disabled={false}
                fontSize={16}
                scheme={app.colorScheme}
                text='Fill test data English / USD'
                onPress={() => showAlert('Fill in test data?', () => {
                    devSettings.testDataProvider.fillTestDataEnglish(app.year, app.month, app.day)
                    app.init()
                })}
            />
            <TextButton
                height={48}
                disabled={false}
                fontSize={16}
                scheme={app.colorScheme}
                text={isClearingData ? 'Wait...' : 'Clear all data'}
                onPress={() => showAlert('Clear all storages?', () => {
                    setIsClearingData(true)
                    AsyncStorage.clear().then(() => {
                        setIsClearingData(false)
                    })
                })}
            />
        </View>
    </View>

    function showAlert(title: string, onPress: () => void) {
        Alert.alert(title, 'It will erase all the data you have in your app right now',
            [
                {text: 'Ok', onPress: onPress, style: 'default'},
                {text: 'Cancel', onPress: () => { }, style: 'cancel'},
            ]
        )
    }
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    headerContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: DeviceState.screenSize === 'S' ? 8 : 24,
        marginBottom: 48,
    },
    header: {
        fontSize: DeviceState.screenSize === 'S' ? 32 : 36,
        fontWeight: 'bold',
        color: scheme.primaryText
    },
    additionalText: {
        fontSize: DeviceState.screenSize === 'S' ? 16 : 20,
        color: scheme.alternativeSecondaryText,
        fontWeight: 'bold',
        marginTop: 8
    },
    subheader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: scheme.primaryText
    },
    flagLabel: {
        fontSize: 20,
        paddingVertical: 12,
        color: scheme.primaryText
    }
})
