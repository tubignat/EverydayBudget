import React, { useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { ColorScheme } from '../../../color/ColorScheme';
import { ApplicationContext } from '../../../ApplicationContext';
import { TextButton } from '../../common/TextButton';
import { DatePickerModal } from './DatePickerModal';
import { ModalStackState } from '../../../ModalStackState';
import { observer } from 'mobx-react';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const StartOfPeriodSettings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const styles = getStyles(application.colorScheme);

    return <View style={styles.inlineSettingContainer}>
        <Text style={styles.subheader}>{application.locale.startOfPeriod}</Text>
        <TextButton
            scheme={application.colorScheme}
            fontSize={20}
            height={22}
            disabled={false}
            text={application.locale.getStartOfPeriodDateText(application.startOfPeriod, application.month)}
            onPress={onPress}
        />
    </View>

    function onPress(position: { x: number, y: number }) {
        ModalStackState.open(onClose => renderModal(onClose, position.y));
    }

    function renderModal(onClose: () => void, expansionPointY: number) {
        const expansionPoint = {
            x: isBigScreen ? width - 24 - 16 - 82 : width - 24 - 82,
            y: expansionPointY
        };

        return <DatePickerModal key='datePickerModal' expansionPoint={expansionPoint} onClose={onClose} />
    }
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    inlineSettingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        height: 32,
        marginTop: -8
    },
    subheader: {
        color: scheme.secondaryText,
        fontSize: 20,
    },
})