import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';

function Picker(props) {
    return <View style={[styles.pickerContainer, { width: props.width }, props.disabled ? styles.disabledPickerContainer : {}]}
        onMagicTap={props.onPress}
    >
        <Text style={[styles.pickerText, props.disabled ? styles.disabledPickerText : {}]}>{props.text}</Text>
    </View>
}

const styles = StyleSheet.create({
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 50,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    pickerText: {
        fontSize: 15
    },
    disabledPickerText: {
        color: 'lightgray'
    },
    disabledPickerContainer: {

        borderColor: 'lightgray',
    }
});


export default Picker;