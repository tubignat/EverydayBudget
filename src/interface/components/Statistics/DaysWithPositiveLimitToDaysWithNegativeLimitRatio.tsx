import {StatCard} from "./StatCard";
import {useContextUnsafe} from "../../Hooks";
import {ApplicationContext} from "../../Contexts";
import React from "react";
import {Text} from "react-native";
import {observable} from "mobx";
import {observer} from "mobx-react";

export const DaysWithPositiveLimitToDaysWithNegativeLimitRatio = observer(() => {
    const app = useContextUnsafe(ApplicationContext)
    return <StatCard title={app.locale.daysWithPositiveLimit}>
        <Text style={{fontSize: 40, color: 'white', padding: 24}}>
            {
                app
                    .daysWithPositiveLimitToDaysWithNegativeLimitRatioForMonth
                    .toLocaleString(
                        undefined,
                        {style: 'percent', maximumFractionDigits: 2}
                    )
            }
        </Text>
    </StatCard>
})


