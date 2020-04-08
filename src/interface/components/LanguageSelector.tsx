import React from 'react';
import { Language } from '../../domain/repositories/UserPreferencesRepository';
import { Selector } from './Selector';
import { ColorScheme } from '../color/ColorScheme';

export default function LanguageSelector({ language, onChange, scheme }: { language: Language, onChange: (language: Language) => void, scheme: ColorScheme }) {
    const buttons = [
        {
            text: 'Rus',
            selected: language === 'ru',
            onPress: () => onChange('ru'),
        },
        {
            text: 'Eng',
            selected: language === 'en',
            onPress: () => onChange('en'),
        },
    ];

    return <Selector buttons={buttons} scheme={scheme} />
}