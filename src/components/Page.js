import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');
export default function Page({ children }) {
    return (
        <View>
            <View style={styles.statusBar}/>
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
        height: 20,
        width: '100%',
        zIndex: 2,
        opacity: .9,
        backgroundColor: 'white'
    }
});