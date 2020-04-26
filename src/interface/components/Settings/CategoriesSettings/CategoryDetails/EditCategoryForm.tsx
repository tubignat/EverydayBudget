import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { ColorScheme } from '../../../../color/ColorScheme';
import { Locale } from '../../../../locale/Locale';
import { CategoryColor } from '../../../../../domain/entities/CategoryColor';
import { ColorPicker } from './ColorPicker';

interface IEditCategoryFormProps {
    scheme: ColorScheme
    locale: Locale
    allColors: CategoryColor[]
    name: string
    onNameChange: (changedName: string) => void
    color: CategoryColor
    onColorChange: (changedColor: CategoryColor) => void
}

export function EditCategoryForm(props: IEditCategoryFormProps) {
    const styles = getStyles(props.scheme);
    return <View style={styles.container}>
        <Text style={styles.label}>{props.locale.categoryName}</Text>
        <TextInput style={styles.nameInput} value={props.name} onChangeText={props.onNameChange} selectTextOnFocus={true} />

        <Text style={styles.label}>{props.locale.categoryColor}</Text>
        <ColorPicker scheme={props.scheme} allColors={props.allColors} chosenColor={props.color} onColorClick={props.onColorChange} />
    </View>
}

const getStyles = (scheme: ColorScheme) => StyleSheet.create({
    container: {
        backgroundColor: scheme.background,
        padding: 32,
        borderRadius: 16
    },
    label: {
        fontSize: 16,
        color: scheme.secondaryText,
        marginBottom: 12
    },
    nameInput: {
        fontSize: 20,
        marginBottom: 32,
        color: scheme.primaryText
    }
})

