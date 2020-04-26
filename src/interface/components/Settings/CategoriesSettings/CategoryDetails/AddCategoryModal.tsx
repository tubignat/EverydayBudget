import React, { useContext, useEffect, useState } from 'react';
import { View, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ColorScheme } from '../../../../color/ColorScheme';
import { ContextMenuButton } from './ContextMenuButton';
import { EditCategoryForm } from './EditCategoryForm';
import { ApplicationContext } from '../../../../ApplicationContext';

interface IAddCategoryModalProps {
    onClose: () => void
}

const offset = 488;

export function AddCategoryModal(props: IAddCategoryModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [translateY] = useState(new Animated.Value(offset))
    useEffect(open, []);

    const [name, setName] = useState(application.locale.newCategoryName);
    const [color, setColor] = useState(application.categoryColors[0]);

    const [isBeingClose, setIsBeingClosed] = useState(false);
    const styles = getStyles(application.colorScheme, translateY);

    return <Animated.View style={styles.backdrop}>
        <TouchableWithoutFeedback style={styles.backdropTouchable} onPress={close}>
            <View style={styles.backdropTouchableInner} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
            <Animated.View style={styles.container}>
                <EditCategoryForm
                    scheme={application.colorScheme}
                    locale={application.locale}
                    name={name}
                    onNameChange={setName}
                    color={color}
                    onColorChange={setColor}
                    allColors={application.categoryColors}
                />
                <ContextMenuButton
                    text={application.locale.add}
                    color={application.colorScheme.primary}
                    onPress={() => !isBeingClose && add()}
                    scheme={application.colorScheme}
                />
                <ContextMenuButton
                    text={application.locale.cancel}
                    color={application.colorScheme.primary}
                    onPress={close}
                    scheme={application.colorScheme}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    </Animated.View>

    function add() {
        application?.addCategory(name, color);
        close();
    }

    function open() {
        Animated.spring(translateY, { toValue: 0, bounciness: 0 }).start();
    }

    function close() {
        setIsBeingClosed(true);
        Animated.timing(translateY, { toValue: offset, duration: 300 }).start(props.onClose);
    }
}

function getStyles(
    scheme: ColorScheme,
    translateY: Animated.Value,
): any {

    return {
        backdrop: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            alignContent: 'center',
            zIndex: 30,
            backgroundColor: translateY.interpolate({
                inputRange: [0, offset],
                outputRange: ['rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 0)']
            })
        },
        backdropTouchable: {
            width: '100%',
            height: '100%',
        },
        backdropTouchableInner: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        container: {
            marginHorizontal: 16,
            marginVertical: 48,
            transform: [
                { translateY: translateY }
            ]
        }
    }
};