import React, {useContext, useState} from 'react';
import {EditCategoryForm} from './EditCategoryForm';
import {ApplicationContext} from '../../../../Contexts';
import {ModalWithContextMenu} from './ModalWithContextMenu';
import {useContextUnsafe} from "../../../../Hooks";

interface IAddCategoryModalProps {
    onClose: () => void
}

export function AddCategoryModal(props: IAddCategoryModalProps) {
    const application = useContextUnsafe(ApplicationContext);

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
