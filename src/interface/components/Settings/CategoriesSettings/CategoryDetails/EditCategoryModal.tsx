import React, { useContext, useState } from 'react';
import { EditCategoryForm } from './EditCategoryForm';
import { ApplicationContext } from '../../../../ApplicationContext';
import { Category } from '../../../../../domain/entities/Category';
import { ModalWithContextMenu } from './ModalWithContextMenu';

interface IEditCategoryModalProps {
    onClose: () => void
    category: Category
}

export function EditCategoryModal(props: IEditCategoryModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [name, setName] = useState(props.category.name);
    const [color, setColor] = useState(props.category.color);

    const buttons = [
        {
            text: application.locale.save,
            color: application.colorScheme.primary,
            onPress: () => application.editCategory(props.category, name, color)
        },
        {
            text: application.locale.remove,
            color: application.colorScheme.danger,
            onPress: () => application.removeCategory(props.category)
        }
    ]

    return <ModalWithContextMenu onClose={props.onClose} scheme={application.colorScheme} buttons={buttons}>
        <EditCategoryForm
            scheme={application.colorScheme}
            locale={application.locale}
            name={name}
            onNameChange={setName}
            color={color}
            onColorChange={setColor}
            allColors={application.categoryColors}
        />
    </ModalWithContextMenu>
}