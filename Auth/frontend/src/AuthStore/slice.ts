import type { User } from '@/models/AuthModels'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    user: User | null,
    isAuth: boolean
}

const initialState: AuthState = {
    user: null,
    isAuth: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        LoginUser: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            state.isAuth = true;
            state.user = action.payload.user
        },
        LogoutUser: (
            state,
        ) => {
            state.isAuth = false;
            state.user = null
        },
        UpdateUser: (
            state,
            action: PayloadAction<{ user: Partial<User> }>
        ) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload.user
                };
            }
        },
        UpdateUserFull: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            state.user = action.payload.user;
        }
    }
})

export const { LoginUser, LogoutUser, UpdateUser, UpdateUserFull } = authSlice.actions

export default authSlice.reducer