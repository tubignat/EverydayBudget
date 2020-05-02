import React, { useContext, useState } from 'react';
import { EditCategoryForm } from './EditCategoryForm';
import { ApplicationContext } from '../../../../ApplicationContext';
import { ModalWithContextMenu } from './ModalWithContextMenu';
import { observer } from 'mobx-react';
import { Alert } from 'react-native';

interface IEditCategoryModalProps {
    onClose: () => void
    categoryId: number
}

export const EditCategoryModal = observer((props: IEditCategoryModalProps) => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const category = application.categories.find(c => c.id === props.categoryId);
    if (!category) {
        throw new Error('Category not found');
    }

    const buttons = [
        {
            text: application.locale.remove,
            color: application.colorScheme.danger,
            onPress: () => {
                Alert.alert(
                    application.locale.removeCategoryQuestion,
                    application.locale.removeCategoryDialogMessage,
                    [
                        { text: application.locale.remove, onPress: () => application.removeCategory(category), style: 'destructive' },
                        { text: application.locale.cancel, onPress: () => { }, style: 'cancel' },
                    ])
            }
        }
    ]

    return <ModalWithContextMenu onClose={props.onClose} scheme={application.colorScheme} buttons={buttons}>
        <EditCategoryForm
            scheme={application.colorScheme}
            locale={application.locale}
            name={category.name}
            onNameChange={newName => application.editCategory(category, newName, category.color)}
            color={category.color}
            onColorChange={newColor => application.editCategory(category, category.name, newColor)}
            allColors={application.categoryColors}
        />
    </ModalWithContextMenu>
})