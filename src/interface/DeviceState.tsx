import {Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');

export class DeviceStateImpl {
    public constructor(public height: number, public width: number) { }

    public screenSize: ScreenSize = this.width < 350
        ? 'S'
        : this.height > 800 ? 'L' : 'M'
}

export type ScreenSize = 'S' | 'M' | 'L' // S ~ iPhone SE 1st generation, M ~ iPhone 7/8, L ~ iPhone 12 Mini and bigger

export const DeviceState = new DeviceStateImpl(height, width)
