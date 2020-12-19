import {View} from "react-native";
import {ColorScheme} from "../../color/ColorScheme";
import {useContextUnsafe} from "../../Hooks";
import {ApplicationContext} from "../../Contexts";
import React, {ReactNode} from "react";
import {DeviceState} from "../../DeviceState";
import { Text } from "react-native";

export function StatCard(props: { title: string, halfSize?: boolean, children?: ReactNode }) {
    const app = useContextUnsafe(ApplicationContext)
    const styles = getStyles(app.colorScheme, props.halfSize ?? false)
    return <View>
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            {props.children}
        </View>
    </View>
}

const getStyles = (scheme: ColorScheme, halfSize: boolean): any => {
    return {
        container: {
            backgroundColor: 'black',
            borderRadius: 16,
            margin: 12,
            width: halfSize ? (DeviceState.width - 24) / 2 - 12 : DeviceState.width - 24
        },
        title: {
            fontSize: 28,
            color: 'white',
            fontWeight: 'bold',
            marginTop: 24,
            marginLeft: 24
        }
    }
}
