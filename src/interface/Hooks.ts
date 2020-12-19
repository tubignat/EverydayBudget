import {Context, useContext} from "react";

export function useContextUnsafe<T>(context: Context<T | undefined>): T {
    const obj = useContext(context)
    if (!obj) {
        throw Error('Context was undefined')
    }

    return obj
}
