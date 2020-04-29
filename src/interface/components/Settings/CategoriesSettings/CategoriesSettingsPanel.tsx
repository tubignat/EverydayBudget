import { observer } from "mobx-react";
import React, { useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { TextButton } from '../../common/TextButton';
import { ApplicationContext } from '../../../ApplicationContext';
import { ColorScheme } from '../../../color/ColorScheme';
import { ModalStackState } from "../../../ModalStackState";
import SlidingUpPanel from "../../common/SlidingUpPanel";
import { AddCategoryModal } from "./CategoryDetails/AddCategoryModal";
import { CategoriesList } from "./CategoriesList";
import { Category } from "../../../../domain/entities/Category";
import { EditCategoryModal } from "./CategoryDetails/EditCategoryModal";

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isBigScreen = height > 800;

export const CategoriesSettingsPanel = observer(({ onClose }: { onClose: () => void }) => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const openAddCategoryModal = () => ModalStackState.open(onClose => <AddCategoryModal key='addCategoryModal' onClose={onClose} />)
    const openEditCategoryModal = (category: Category) => ModalStackState.open(
        onClose => <EditCategoryModal key='editCategoryModal' onClose={onClose} category={category} />
    )

    const styles = getStyles(application.colorScheme);
    const offset = isBigScreen ? 75 : 50;

    return <SlidingUpPanel colorScheme={application.colorScheme} offsetTop={offset} onClose={onClose}>
        <View style={{ paddingBottom: 70, marginHorizontal: isSmallScreen ? -8 : 0 }}>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>{application.locale.categories}</Text>
                <Text style={styles.additionalText}>{application.locale.categoriesAdditionalText}</Text>
            </View>

            <CategoriesList
                scheme={application.colorScheme}
                categories={application.categories}
                onPress={openEditCategoryModal}
            />

            <View style={styles.addButtonContainer}>
                <TextButton
                    text={application.locale.add}
                    height={40}
                    width={'100%'}
                    fontSize={application.locale.add.length > 5 ? 20 : 24}
                    onPress={openAddCategoryModal}
                    scheme={application.colorScheme}
                    disabled={false}
                />
            </View>
        </View>

    </SlidingUpPanel>
});

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    headerContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: isSmallScreen ? 8 : 24,
        marginBottom: 48,
    },
    header: {
        fontSize: isSmallScreen ? 32 : 36,
        fontWeight: 'bold',
        color: scheme.primaryText
    },
    additionalText: {
        fontSize: isSmallScreen ? 16 : 20,
        color: scheme.alternativeSecondaryText,
        fontWeight: 'bold',
        marginTop: 8
    },
    addButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})