import {Text, View} from "react-native";
import React from "react";
import {ColorScheme} from "../../color/ColorScheme";
import {DeviceState} from "../../DeviceState";

export function PageHeader(props: { header: string, scheme: ColorScheme }) {
    const styles = getStyles(props.scheme)
    return <View style={styles.headerContainer}>
        <Text style={styles.header}>
            {props.header}
        </Text>
    </View>
}

const getStyles = (scheme: ColorScheme): any => {
    return {
        header: {
            fontSize: 36,
            fontWeight: 'bold',
            marginBottom: 40,
            color: scheme.primaryText
        },
        headerContainer: {
            paddingLeft: 24,
            paddingRight: DeviceState.screenSize === 'S' ? 12 : 24,
            paddingTop: DeviceState.screenSize === 'L' ? 72 : 48,
        },
    }
}
