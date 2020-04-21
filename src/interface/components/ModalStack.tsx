import React from 'react';
import { Animated, View } from 'react-native';
import { ModalStackState } from '../ModalStackState';
import { observer } from 'mobx-react';
import { ColorScheme } from '../color/ColorScheme';

export const ModalStack = observer((props: { colorScheme: ColorScheme, children: any }) => {
    return <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
        {
            ModalStackState.registeredModals.map(renderModal => renderModal())
        }
        <Animated.View style={{ width: '100%', height: '100%', backgroundColor: props.colorScheme.background, ...ModalStackState.mainViewStyle }}>
            <Animated.View style={{ width: '100%', height: '100%', ...ModalStackState.mainViewContentStyle }}>
                {
                    props.children
                }
            </Animated.View>
        </Animated.View>
    </View>
})