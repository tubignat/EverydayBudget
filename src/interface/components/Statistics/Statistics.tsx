import {observer} from "mobx-react";
import {Page} from "../common/Page";
import React, {useState} from "react";
import {ApplicationContext, DevSettingsContext} from "../../Contexts";
import {PageHeader} from "../common/PageHeader";
import {useContextUnsafe} from "../../Hooks";
import {ScrollView, View} from "react-native";
import {DistributionByCategories} from "./DistributionByCategories";
import {DistributionByDaysOfWeek} from "./DistributionByDaysOfWeek";
import {Gap} from "../common/Gap";
import {DaysWithPositiveLimitToDaysWithNegativeLimitRatio} from "./DaysWithPositiveLimitToDaysWithNegativeLimitRatio";
import {SpendingsStat} from "./SpendingsStat";
import {SegmentedControl} from "@ant-design/react-native";
import {YandexAdBig} from "../common/YandexAdBanner";
import {FeatureFlag} from "../../../domain/repositories/DevSettingsRepository";

export const Statistics = observer(() => {
    const application = useContextUnsafe(ApplicationContext);
    const devSettings = useContextUnsafe(DevSettingsContext);

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
                <DistributionByCategories forMonth={selectedSegment === segments[0]}/>
                <DistributionByDaysOfWeek forMonth={selectedSegment === segments[0]}/>
                <SpendingsStat forMonth={selectedSegment === segments[0]}/>
                {
                    selectedSegment === segments[0] && <DaysWithPositiveLimitToDaysWithNegativeLimitRatio/>
                }
                {
                    !devSettings.isFlagEnabled(FeatureFlag.NoAds) &&
                    <View style={{width: '100%', marginVertical: 16}}>
                        <YandexAdBig/>
                    </View>
                }
            </View>
        </ScrollView>
    </Page>
})
