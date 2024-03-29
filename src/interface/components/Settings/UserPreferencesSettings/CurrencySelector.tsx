import React from 'react';
import { Currency } from '../../../../domain/repositories/UserPreferencesRepository';
import { Selector } from '../../common/Selector';
import { ColorScheme } from '../../../color/ColorScheme';

export default function CurrencySelector({ currency, onChange, scheme }: { currency: Currency, onChange: (currency: Currency) => void, scheme: ColorScheme }) {
    const buttons = [
        {
            text: '₽',
            selected: currency === '₽',
            onPress: () => onChange('₽'),
            width: 40
        },
        {
            text: '$',
            selected: currency === '$',
            onPress: () => onChange('$'),
            width: 40
        },
        {
            text: '€',
            selected: currency === '€',
            onPress: () => onChange('€'),
            width: 40
        },
    ];

    return <Selector buttons={buttons} scheme={scheme} />
}