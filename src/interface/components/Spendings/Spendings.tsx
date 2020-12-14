import {observer} from "mobx-react";
import {Page} from "../common/Page";
import Swiper from "react-native-swiper";
import {Keyboard} from "react-native";
import React, {useContext} from "react";
import {ApplicationContext} from "../../ApplicationContext";
import TodaySpendings from "./TodaySpendings";
import {MonthSpendings} from "./MonthSpendings";

export const Spendings = observer(() => {
    const application = useContext(ApplicationContext);
    if (!application) {
        return null;
    }

    return <Page scheme={application.colorScheme}>
        <Swiper
            onTouchStart={() => Keyboard.dismiss()}
            loop={false}
            bounces={true}
            dotColor={application.colorScheme.secondaryText}
            activeDotColor={application.colorScheme.primary}
        >
            <TodaySpendings />
            <MonthSpendings />
        </Swiper>
    </Page>
})
