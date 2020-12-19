import {observer} from "mobx-react";
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ApplicationContext, DevSettingsContext} from '../../../Contexts';
import {ColorScheme} from '../../../color/ColorScheme';
import SlidingUpPanel from "../../common/SlidingUpPanel";
import {useContextUnsafe} from "../../../Hooks";
import {DeviceState} from "../../../DeviceState";
import {Switch} from "@ant-design/react-native";

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

            <View style={{paddingHorizontal: 16}}>
                {
                    devSettings.allFeatureFlags().map(flag =>
                        <View key={flag.name} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 20, paddingVertical: 12}}>{flag.name}</Text>
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
        </View>
    </SlidingUpPanel>
});

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
    }
})
