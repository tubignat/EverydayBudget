import React from 'react';
import { ColorScheme } from '../../../color/ColorScheme';
import { KeyBoardButton } from './KeyBoardDigitButton';
import { Locale } from '../../../locale/Locale';
interface IAddSpendingButtonProps {
    onPress: () => void
    disabled: boolean
    scheme: ColorScheme
    locale: Locale
}

export function AddSpendingButton(props: IAddSpendingButtonProps) {
    return <KeyBoardButton
        text={props.locale.add}
        scheme={props.scheme}
        onPress={props.onPress}
        color={props.disabled ? props.scheme.inactive : props.scheme.primary}
        fontSize={14}
        height={48}
        disabled={props.disabled}
    />
}