import { createSlice } from '@reduxjs/toolkit'

export interface UserSlice {
    value: {
        id: number | null,
        name: string,
        email: string,
        referral?: string,
        image: string
    } | null
}
const initialState: UserSlice = {
    value: null
}
export const UserSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload
        }
    }
})
export const { setUser } = UserSlice.actions