import React, { useState, useContext } from 'react';
import { PickerModal } from '../../common/PickerModal';
import { Animated, Dimensions, Text } from 'react-native';
import { ColorScheme } from '../../../color/ColorScheme';
import { ApplicationContext } from '../../../ApplicationContext';
import { DatePicker } from './DatePicker';

interface IDatePickerModalProps {
    expansionPoint: { x: number, y: number }
    onClose: () => void
}

const window = Dimensions.get('window');
const isSmallScreen = window.width < 350;
const isBigScreen = window.height > 800;

export function DatePickerModal(props: IDatePickerModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [anim] = useState(new Animated.Value(0));
    const styles = getStyles(application.colorScheme, anim);

    return <PickerModal
        scheme={application.colorScheme}
        width={isSmallScreen ? window.width - 16 : window.width - 48}
        expansionPoint={props.expansionPoint}
        renderContent={renderContent}
        onClose={props.onClose}
        onOpenAnimationStart={() => Animated.spring(anim, { toValue: 1, bounciness: 0 }).start()}
        onCloseAnimationStart={() => Animated.timing(anim, { toValue: 0, duration: 300 }).start()}
    />

    function renderContent(close: () => void) {
        if (!application) {
            throw new Error('Application was not set')
        }

        const onPress = (day: number) => {
            application.changeStartOfPeriod(day);
            close();
        }

        return <Animated.View style={styles.container}>
            <Text style={styles.header}>{application.locale.getMonthName(application.month)}</Text>
            <DatePicker
                scheme={application.colorScheme}
                locale={application.locale}
                year={application.year}
                month={application.month}
                day={application.day}
                chosenDay={application.startOfPeriod}
                until={application.day}
                cellSize={isBigScreen ? 40 : 35}
                fontSize={isBigScreen ? 20 : 18}
                onPress={onPress}
            />
        </Animated.View>
    }
}

const getStyles = (scheme: ColorScheme, anim: Animated.Value) => {
    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 1]
    });

    const opacity = anim.interpolate({
        inputRange: [0, .25, 1],
        outputRange: [0, 0, 1]
    })

    const fontWeight: 'bold' = 'bold';

    return {
        container: {
            width: '100%',
            padding: isSmallScreen ? 24 : 32,
            transform: [{ scale: scale }],
            opacity: opacity
        },
        header: {
            fontSize: 28,
            fontWeight: fontWeight,
            color: scheme.primaryText,
            marginBottom: 40
        }
    }
}