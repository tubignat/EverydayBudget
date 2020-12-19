import React from "react";
import {View} from "react-native";

export function Gap(props: { size: number }) {
    return <View style={{width: props.size, height: props.size, flexGrow: 0, flexShrink: 0}}/>
}
