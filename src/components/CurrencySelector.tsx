import React from 'react';
import { Currency } from '../domain/UserPreferencesRepository';
import { Selector } from './Selector';

export default function CurrencySelector({ currency, onChange }: { currency: Currency, onChange: (currency: Currency) => void }) {
    const buttons = [
        {
            text: '₽',
            selected: currency === '₽',
            onPress: () => onChange('₽'),
        },
        {
            text: '$',
            selected: currency === '$',
            onPress: () => onChange('$'),
        },
        {
            text: '€',
            selected: currency === '€',
            onPress: () => onChange('€'),
        },
    ];

    return <Selector buttons={buttons} />
}