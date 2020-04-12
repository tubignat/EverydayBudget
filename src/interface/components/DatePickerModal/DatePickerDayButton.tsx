import React from 'react';
import { ButtonWrapper } from "../common/ButtonWrapper";
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';


interface IDatePickerDayButtonProps {
    text: string
    onPress: () => void
    size: number
    fontSize: number
    textColor: string
    backgroundColor: string
    isChosen: boolean
}

export function DatePickerDayButton(props: IDatePickerDayButtonProps) {
    function getCellStyle(): any {
        return {
            height: props.size,
            width: props.size,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            borderColor: props.backgroundColor,
            backgroundColor: props.isChosen ? props.backgroundColor : 'rgba(0, 0, 0, 0)'
        }
    }

    function getTextStyle() {
        return {
            fontSize: props.fontSize,
            color: props.isChosen ? 'white' : props.textColor
        }
    }


    function renderNormal() {
        return <View style={getCellStyle()} key={props.text}>
            <Text style={getTextStyle()}>
                {props.text}
            </Text>
        </View>
    }

    function renderPressed() {
        return <View style={{ ...getCellStyle(), borderWidth: 1 }} key={props.text}>
            <Text style={getTextStyle()}>
                {props.text}
            </Text>
        </View>
    }

    return <ButtonWrapper
        disabled={!props.text}
        onPress={props.onPress}
        renderNormal={renderNormal}
        renderPressed={renderPressed}
    />
}