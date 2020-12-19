import {StatCard} from "./StatCard";
import React from "react";
import {useContextUnsafe} from "../../Hooks";
import {ApplicationContext} from "../../Contexts";
import {Text, View} from "react-native";
import {formatMoney, getTimeString} from "../../NumbersFormats";
import {Spending} from "../../../domain/entities/Spending";
import {observer} from "mobx-react";

export const SpendingsStat = observer((props: { forMonth: boolean }) => {
    const app = useContextUnsafe(ApplicationContext)

    const biggestSpending = props.forMonth ? app.theBiggestSpendingForMonth : app.theBiggestSpending
    const smallestSpending = props.forMonth ? app.theSmallestSpendingForMonth : app.theSmallestSpending
    const average = props.forMonth ? app.averageSpendingForMonth : app.averageSpending

    return <StatCard title={app.locale.spendingsPageTitle}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <SpendingStat amount={biggestSpending?.amount ?? 0} spending={biggestSpending} title={app.locale.biggest}/>
            <SpendingStat amount={smallestSpending?.amount ?? 0} spending={smallestSpending} title={app.locale.smallest}/>
            <SpendingStat amount={average} spending={null} title={app.locale.average}/>
        </View>
    </StatCard>
})

function SpendingStat(props: { amount: number, spending: Spending | null, title: string }) {
    const app = useContextUnsafe(ApplicationContext)

    return <View style={{padding: 24}}>
        <Text style={{color: app.colorScheme.secondaryText, marginBottom: 12}}>{props.title}</Text>
        <Text style={{fontSize: 24, color: 'white'}}>
            {
                `${formatMoney(props.amount)} ${app.currency}`
            }
        </Text>
        {
            props.spending && (
                <Text style={{fontSize: 12, marginTop: 4, color: app.colorScheme.secondaryText}}>
                    {
                        `${props.spending.day} ${app.locale.getMonthNameAbbr(props.spending.month)} ${props.spending.year}`
                    }
                    {
                        props.spending.hour && props.spending.minute
                        && ` ${app.locale.atTime} ${getTimeString(props.spending.hour, props.spending.minute)}`
                    }
                </Text>
            )
        }
    </View>
}
