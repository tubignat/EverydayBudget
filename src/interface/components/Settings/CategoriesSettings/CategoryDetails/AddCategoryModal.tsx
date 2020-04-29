import React, { useContext, useEffect, useState } from 'react';
import { View, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ContextMenuButton } from './ContextMenuButton';
import { EditCategoryForm } from './EditCategoryForm';
import { ApplicationContext } from '../../../../ApplicationContext';
import { ModalWithContextMenu } from './ModalWithContextMenu';

interface IAddCategoryModalProps {
    onClose: () => void
}

export function AddCategoryModal(props: IAddCategoryModalProps) {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    const [name, setName] = useState(application.locale.newCategoryName);
    const [color, setColor] = useState(application.categoryColors[0]);
    const buttons = [{
        text: application.locale.add,
        color: application.colorScheme.primary,
        onPress: () => application.addCategory(name, color)
    }]

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