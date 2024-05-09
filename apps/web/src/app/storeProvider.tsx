'use client'
import { ReactNode, useEffect, useRef } from "react"
import { AppStore, makeStore } from "./lib/features/store"
import { Provider } from "react-redux"
import { setupListeners } from '@reduxjs/toolkit/query'

interface Props {
    readonly children: ReactNode
}
export const StoreProvider = ({ children}: Props) => {
    const storeRef = useRef<AppStore | null>(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    useEffect(() => {
        if (storeRef.current != null) {
            const unsubscribe = setupListeners(storeRef.current.dispatch)
            return unsubscribe
        }
    }, [])

    return <Provider store={storeRef.current}>{children}</Provider>
}