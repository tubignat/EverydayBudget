import React from 'react';
import { ColorSchemePreference } from '../../domain/repositories/UserPreferencesRepository';
import { Selector } from './Selector';
import { ColorScheme } from '../color/ColorScheme';

interface IColorSchemeSelectorProps {
    preference: ColorSchemePreference,
    onChange: (preference: ColorSchemePreference) => void,
    scheme: ColorScheme
}

export default function ColorSchemeSelector({ preference, onChange, scheme }: IColorSchemeSelectorProps) {
    const buttons = [
        {
            text: 'Light',
            selected: preference === 'light',
            onPress: () => onChange('light'),
            width: 50
        },
        {
            text: 'Dark',
            selected: preference === 'dark',
            onPress: () => onChange('dark'),
            width: 50
        },
        {
            text: 'Auto',
            selected: preference === 'auto',
            onPress: () => onChange('auto'),
            width: 50
        },
    ];

    return <Selector buttons={buttons} scheme={scheme} />
}