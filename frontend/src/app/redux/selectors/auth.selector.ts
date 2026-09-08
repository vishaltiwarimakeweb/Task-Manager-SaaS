import { RootState } from "../store";

export const userSelector = (state: RootState) => state.auth.user;
export const loginSelector = (state: RootState) => state.auth.isLogin;
