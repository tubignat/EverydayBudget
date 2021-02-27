import {observer} from "mobx-react";
import {Page} from "../common/Page";
import React, {useState} from "react";
import {ApplicationContext} from "../../Contexts";
import {PageHeader} from "../common/PageHeader";
import {useContextUnsafe} from "../../Hooks";
import {ScrollView, SegmentedControlIOS, View} from "react-native";
import {DistributionByCategories} from "./DistributionByCategories";
import {DistributionByDaysOfWeek} from "./DistributionByDaysOfWeek";
import {Gap} from "../common/Gap";
import {DaysWithPositiveLimitToDaysWithNegativeLimitRatio} from "./DaysWithPositiveLimitToDaysWithNegativeLimitRatio";
import {SpendingsStat} from "./SpendingsStat";
import {colorNames} from "react-native-svg/lib/typescript/lib/extract/extractColor";
import {SegmentedControl} from "@ant-design/react-native";

export const Statistics = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

    const segments = [application.locale.month, application.locale.allTime]
    const [selectedSegment, setSelectedSegment] = useState(segments[0])

    return <Page scheme={application.colorScheme}>
        <ScrollView>
            <PageHeader header={application.locale.statisticsPageTitle} scheme={application.colorScheme}/>
            <View style={{paddingHorizontal: 16}}>
                <SegmentedControl
                    tintColor={application.colorScheme.primary}
                    values={segments}
                    selectedIndex={segments.findIndex(value => value === selectedSegment)}
                    onValueChange={setSelectedSegment}
                />
            </View>

            <Gap size={16}/>

            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <DistributionByDaysOfWeek forMonth={selectedSegment === segments[0]}/>
                <DistributionByCategories forMonth={selectedSegment === segments[0]}/>
                <SpendingsStat forMonth={selectedSegment === segments[0]}/>
                {
                    selectedSegment === segments[0] && <DaysWithPositiveLimitToDaysWithNegativeLimitRatio/>
                }
            </View>
        </ScrollView>
    </Page>
})
