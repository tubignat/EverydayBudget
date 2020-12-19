import {Dimensions, View} from "react-native";
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
    const data = {
        labels: [1, 2, 3, 4, 5, 6, 0].map(dayOfWeek => app.locale.getDayOfWeekAbbr(dayOfWeek)),
        datasets: [
            {data: props.forMonth ? app.distributionByDaysOfWeekForMonth : app.distributionByDaysOfWeek}
        ]
    };

    return <StatCard title={app.locale.distributionByDaysOfWeek}>
        <BarChart
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
    </StatCard>
})
