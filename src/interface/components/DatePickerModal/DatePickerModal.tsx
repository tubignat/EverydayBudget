import React, { useState, useContext } from 'react';
import { PickerModal } from '../PickerModal';
import { StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { ColorScheme } from '../../color/ColorScheme';
import { ApplicationContext } from '../../ApplicationContext';
import { DatePicker } from './DatePicker';

interface IDatePickerModalProps {
    scheme: ColorScheme
    isOpen: boolean
    expansionPoint: { x: number, y: number }
    chosenDay: number
    onBackdropClick: () => void
    onDateClick: (day: number) => void
}

const window = Dimensions.get('window');
const isSmallScreen = window.width < 350;
const isBigScreen = window.height > 800;

export function DatePickerModal(props: IDatePickerModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(props.scheme);

    const [anim] = useState(new Animated.Value(props.isOpen ? 1 : 0));

    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: props.isOpen ? [2, 1] : [1, 1]
    })

    return <PickerModal
        width={isSmallScreen ? window.width - 16 : window.width - 48}
        onOpenAnimationStart={() => Animated.spring(anim, { toValue: 1 }).start()}
        onCloseAnimationStart={() => Animated.timing(anim, { toValue: 0, duration: 300 }).start()}
        {...props}
    >
        <Animated.View style={{ ...styles.container, transform: [{ scale: scale }] }}>
            <Text style={styles.header}>{application.locale.getMonthName(application.month)}</Text>
            <DatePicker
                scheme={application.colorScheme}
                locale={application.locale}
                year={application.year}
                month={application.month}
                day={application.day}
                chosenDay={props.chosenDay}
                until={application.day}
                cellSize={isBigScreen ? 40 : 35}
                fontSize={isBigScreen ? 20 : 18}
                onPress={props.onDateClick}
            />
        </Animated.View>
    </PickerModal>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        width: '100%',
        padding: isSmallScreen ? 24 : 32,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: scheme.primaryText,
        marginBottom: 40
    }
})