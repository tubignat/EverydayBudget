import React from 'react';
import { View } from 'react-native';
import { Spending, SpendingId } from '../../../../domain/entities/Spending';
import { ColorScheme } from '../../../color/ColorScheme';
import { Currency } from '../../../../domain/repositories/UserPreferencesRepository';
import { observer } from 'mobx-react';
import { Locale } from '../../../locale/Locale';
import { SpendingView } from './SpendingView';
import { Category } from '../../../../domain/entities/Category';

interface ISpendingsListProps {
    spendings: Spending[]
    remove: (id: SpendingId) => void
    edit: (id: SpendingId, amount: number, category: Category | null) => void
    scheme: ColorScheme
    locale: Locale
    currency: Currency
    shouldPlayEnterAnimation: boolean
    shouldFocusAddedSpending: boolean
    onRemoveAnimationStart?: () => void
}

export const SpendingsList = observer((props: ISpendingsListProps) => {

    return <View>
        {
            props.spendings.map(s =>
                <SpendingView
                    key={s.id}
                    spending={s}
                    onRemovePressed={() => props.remove(s.id)}
                    onAmountEdit={amount => props.edit(s.id, amount, s.category)}
                    {...props}
                />
            )
        }
    </View>
});
