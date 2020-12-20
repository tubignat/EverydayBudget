export enum UserEvent {
    RateAppModal
}

export interface UserInfo {
    created: Date
    seenEvents: UserEvent[]
}
