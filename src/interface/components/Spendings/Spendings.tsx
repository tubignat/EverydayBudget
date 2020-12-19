import {observer} from "mobx-react";
import {Page} from "../common/Page";
import Swiper from "react-native-swiper";
import {Keyboard} from "react-native";
import React, {useContext} from "react";
import {ApplicationContext} from "../../Contexts";
import TodaySpendings from "./TodaySpendings";
import {MonthSpendings} from "./MonthSpendings";
import {useContextUnsafe} from "../../Hooks";

export const Spendings = observer(() => {
    const application = useContextUnsafe(ApplicationContext);

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
