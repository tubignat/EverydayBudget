import { observer } from "mobx-react";
import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextButton } from '../../common/TextButton';
import { ApplicationContext } from '../../../Contexts';
import { ColorScheme } from '../../../color/ColorScheme';
import { ModalStackState } from "../../../ModalStackState";
import { CategoriesSettingsPanel } from "./CategoriesSettingsPanel";
import {useContextUnsafe} from "../../../Hooks";

export const CategoriesSettings = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

    const renderModal = (onClose: () => void) => <CategoriesSettingsPanel key='categoriesPanel' onClose={onClose} />

    const styles = getStyles(application.colorScheme);

    return <View style={styles.inlineSettingContainer}>
        <Text style={styles.subheader}>{application.locale.categories}</Text>
        <TextButton
            scheme={application.colorScheme}
            fontSize={20}
            height={22}
            disabled={false}
            text={application.locale.configureCategories}
            onPress={() => ModalStackState.open(renderModal)}
        />
    </View>
})

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    inlineSettingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        height: 32,
    },
    subheader: {
        color: scheme.secondaryText,
        fontSize: 20,
    },
})
