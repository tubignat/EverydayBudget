import React from 'react';
import { Language } from '../../domain/repositories/UserPreferencesRepository';
import { Selector } from './Selector';

export default function LanguageSelector({ language, onChange }: { language: Language, onChange: (language: Language) => void }) {
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

    return <Selector buttons={buttons} />
}