import {Text, View} from "react-native";
import {BarChart} from "react-native-chart-kit";
import {commonChartConfig} from "./common";
import React from "react";
import {useContextUnsafe} from "../../Hooks";
import {ApplicationContext} from "../../Contexts";
import {StatCard} from "./StatCard";
import {DeviceState} from "../../DeviceState";
import {observer} from "mobx-react";
import {abbreviateNumber} from "../../NumbersFormats";

export const DistributionByDaysOfWeek = observer((props: { forMonth: boolean }) => {
    const app = useContextUnsafe(ApplicationContext)
    const distribution = props.forMonth ? app.distributionByDaysOfWeekForMonth : app.distributionByDaysOfWeek

    const data = {
        labels: [1, 2, 3, 4, 5, 6, 0].map(dayOfWeek => app.locale.getDayOfWeekAbbr(dayOfWeek)),
        datasets: [{data: distribution}]
    };

    return <StatCard title={app.locale.distributionByDaysOfWeek}>
        {
             hasAnyData() && <BarChart
                data={data}
                width={DeviceState.width - 24} // from react-native
                height={250}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero={true}
                chartConfig={{
                    ...commonChartConfig,
                    data: data.datasets,
                    formatYLabel: (value) => abbreviateNumber(Number(value))
                }}
                style={{
                    marginTop: 24,
                    marginBottom: 8,
                    borderRadius: 16,
                }}
            />
        }
        {
            !hasAnyData() && <View style={{alignItems: 'center', justifyContent: 'center', height: 250}}>
                <Text style={{fontSize: 24, color: app.colorScheme.secondaryText}}>
                    {app.locale.noData}
                </Text>
            </View>
        }

    </StatCard>


    function hasAnyData() {
        return distribution.filter(value => value !== 0).length > 0
    }
})
