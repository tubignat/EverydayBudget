import React, { Component } from 'react';
import { IconButton } from '../components/IconButton';
import { ScrollView, View, Text, TextInput, Dimensions, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { observer } from 'mobx-react';
import TextInputWithTemporaryInvalidValue from '../components/TextInputWithTemporaryInvalidValue';
import { TextButton } from '../components/TextButton';

export default function Page({ children }) {
    return (
        <View>
            <View style={styles.statusBar}></View>
            <View style={styles.content}>
                {
                    children
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
    },
    statusBar: {
        position: 'absolute',
        height: 20,
        width: '100%',
        zIndex: 2,
        opacity: .9,
        backgroundColor: 'white'
    }
})