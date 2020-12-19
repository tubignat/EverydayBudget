import {CheckBox, Dimensions, View} from "react-native";
import {PieChart} from "react-native-chart-kit";
import React, {useState} from "react";
import {commonChartConfig} from "./common";
import {useContextUnsafe} from "../../Hooks";
import {ApplicationContext} from "../../Contexts";
import {StatCard} from "./StatCard";
import {DeviceState} from "../../DeviceState";
import {observer} from "mobx-react";
import {Text} from "react-native";
import {Switch} from "@ant-design/react-native";

export const DistributionByCategories = observer((props: { forMonth: boolean }) => {
    const application = useContextUnsafe(ApplicationContext);
    const [showNoCategory, setShowNoCategory] = useState(false)

    const pieChartData = (props.forMonth ? application.distributionByCategoryForMonth : application.distributionByCategory)
        .filter(d => showNoCategory || d.category)
        .sort((a, b) => a.amount < b.amount ? 1 : -1).map(d => {
            return {
                name: d.category?.name ?? application.locale.noCategory,
                population: d.amount,
                color: d.category?.color.color ?? application.colorScheme.inactive,
                legendFontColor: "white",
                legendFontSize: 10
            }
        })

    return <StatCard title={application.locale.distributionByCategories}>
        {
            pieChartData.length > 0 && <PieChart
                data={pieChartData}
                width={DeviceState.width - 24}
                height={220}
                chartConfig={commonChartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"16"}
                center={[0, 0]}
            />
        }
        {
            pieChartData.length === 0 && <View style={{alignItems: 'center', justifyContent: 'center', height: 220}}>
                <Text style={{fontSize: 24, color: application.colorScheme.secondaryText}}>
                    {application.locale.noData}
                </Text>
            </View>
        }
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24}}>
            <Text style={{color: 'white', fontSize: 16}}>{application.locale.showNoCategory}</Text>
            <Switch checked={showNoCategory} onChange={setShowNoCategory}/>
        </View>
    </StatCard>
})
