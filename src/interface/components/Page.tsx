import React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { ColorScheme } from '../color/ColorScheme';
import { darkColorScheme } from '../color/DarkColorScheme';

const { height, width } = Dimensions.get('window');
const isBigScreen = height > 800;
export default function Page({ children, scheme }: { children: JSX.Element | (JSX.Element | boolean)[], scheme: ColorScheme }) {
    return (
        <View>
            <StatusBar
                hidden={false}
                barStyle={scheme.background === darkColorScheme.background ? 'light-content' : 'dark-content'}
            />
            <View style={{ ...styles.statusBar, backgroundColor: scheme.background }} />
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
        width: width,
        height: height
    },
    statusBar: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
        opacity: .9,
        height: isBigScreen ? 40 : 20
    }
});