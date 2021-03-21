import {requireNativeComponent, View} from 'react-native';
import React from "react";

const EDBYandexAdBanner = requireNativeComponent('EDBYandexAdBanner');
const EDBYandexAdBannerBig = requireNativeComponent('EDBYandexAdBannerBig');

export function YandexAd() {
    return <View style={{height: 50, marginBottom: 16, alignSelf: 'center', width: 320}}>
        <EDBYandexAdBanner
            // @ts-ignore
            style={{flex: 1}}
        />
    </View>
}

export function YandexAdBig() {
    return <View style={{height: 250, width: 300, alignSelf: 'center'}}>
        <EDBYandexAdBannerBig
            // @ts-ignore
            style={{flex: 1}}
        />
    </View>
}





