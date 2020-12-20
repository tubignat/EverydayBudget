import {FeatureFlag, IDevSettingsRepository} from "../domain/repositories/DevSettingsRepository";
import {computed, observable} from "mobx";
import {TestDataProvider} from "../testData/TestDataProvider";

export class DevSettingsState {
    constructor(private devSettingsRepository: IDevSettingsRepository, public testDataProvider: TestDataProvider) { }

    public init = () => {
        const settings = this.devSettingsRepository.get()

        this.enabledFlags = settings.enabledFlags
        this.devMenuVisible = settings.devMenuVisible
    }

    @observable public enabledFlags: FeatureFlag[] = []
    @observable public devMenuVisible: boolean = false

    isFlagEnabled = (featureFlag: FeatureFlag) => this.enabledFlags.includes(featureFlag)

    public allFeatureFlags = (): { name: string, value: FeatureFlag }[] => {
        return Object.keys(FeatureFlag)
            .filter(key => typeof FeatureFlag[key as any] === "number")
            .map(key => {
                return {
                    name: key,
                    value: FeatureFlag[key as any] as unknown as FeatureFlag
                }
            })
    }

    public switchDevMenuVisibility = () => {
        this.devSettingsRepository.set({
            enabledFlags: this.enabledFlags,
            devMenuVisible: !this.devMenuVisible
        })

        this.init()
    }

    public switchFeatureFlag(featureFlag: FeatureFlag) {
        const updatedFlags = this.isFlagEnabled(featureFlag)
            ? this.enabledFlags.filter(flag => flag !== featureFlag)
            : this.enabledFlags.concat(featureFlag)

        this.devSettingsRepository.set({
            enabledFlags: updatedFlags,
            devMenuVisible: this.devMenuVisible
        })

        this.init()
    }
}
