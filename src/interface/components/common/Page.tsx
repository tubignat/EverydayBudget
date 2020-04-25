import React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';
import { darkColorScheme } from '../../color/DarkColorScheme';
import { observer } from 'mobx-react';
import { ModalStackState } from '../../ModalStackState';
import { lightColorScheme } from '../../color/LightColorScheme';

const { height, width } = Dimensions.get('window');
const isBigScreen = height > 800;
export const Page = observer(({ children, scheme }: { children: JSX.Element | (JSX.Element | boolean)[], scheme: ColorScheme }) => {

    const isModalOpen = ModalStackState.registeredModals.length !== 0;

    const barStyle = !isModalOpen && scheme.background === lightColorScheme.background ? 'dark-content' : 'light-content';

    return (
        <View>
            <StatusBar hidden={false} barStyle={barStyle} />
            {
                !isModalOpen && <View style={{ ...styles.statusBar, backgroundColor: scheme.background }} />
            }
            <View style={styles.content}>
                {
                    children
                }
            </View>
        </View>
    );
});

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