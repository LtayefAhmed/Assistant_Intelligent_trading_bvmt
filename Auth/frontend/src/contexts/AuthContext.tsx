import { useSelector, useDispatch } from 'react-redux';
import { LoginUser as loginAction, LogoutUser as logoutAction, UpdateUser as UpdateUser, UpdateUserFull as UpdateUserFull } from '@/AuthStore/slice';
import type { AppDispatch, RootState } from '@/AuthStore/store';
import type { User } from '@/models/AuthModels';

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, isAuth } = useSelector((state: RootState) => state.auth);

    const LoginUser = (user: User) => {
        dispatch(loginAction({ user }));
    };

    const LogoutUser = () => {
        dispatch(logoutAction());
    };

    const updateUser = (userData: Partial<User>) => {
        dispatch(UpdateUser({ user: userData }));
    };

    const updateUserFull = (userData: User) => {
        dispatch(UpdateUserFull({ user: userData }));
    };

    return {
        user,
        isAuth,
        LoginUser,
        LogoutUser,
        updateUser,
        updateUserFull,
    };
};