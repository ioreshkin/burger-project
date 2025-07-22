import {IUser} from "../../../utils/types.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {request, requestWithAuth} from "../request.ts";

export interface IGetUserResponse {
    success: boolean,
    user: IUser
}

interface IPatchUserRequest extends IUser {
    password: string;
}

interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

interface IForgotPasswordRequest {
    email: string;
}

interface IForgotPasswordResponse {
    success: boolean;
    message: string;
}

interface IResetPasswordRequest {
    token: string;
    password: string;
}

interface IResetPasswordResponse {
    success: boolean;
    message: string;
}

interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface IRegisterResponse {
    success: boolean;
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export const fetchLogin = createAsyncThunk<ILoginResponse, ILoginRequest>(
    "user/fetchLogin",
    async (data, { rejectWithValue }) => {
        try {
            return await request("auth/login", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({email: data.email, password: data.password})});
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchLogout = createAsyncThunk(
    "user/fetchLogout",
    async (_, { rejectWithValue }) => {
        try {
            return await request("auth/logout", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({token: localStorage.getItem("refreshToken")})});
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchRegister = createAsyncThunk<IRegisterResponse, IRegisterRequest>(
    "user/fetchRegister",
    async (data, { rejectWithValue }) => {
        try {
            return await request("auth/register", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({email: data.email, password: data.password, name: data.name})});
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchForgotPassword = createAsyncThunk<IForgotPasswordResponse, IForgotPasswordRequest>(
    "user/fetchForgotPassword",
    async (data, { rejectWithValue }) => {
        try {
            return await request("password-reset", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({email: data.email})});
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchResetPassword = createAsyncThunk<IResetPasswordResponse, IResetPasswordRequest>(
    "user/fetchResetPassword",
    async (data, { rejectWithValue }) => {
        try {
            return await request("password-reset/reset", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({token: data.token, password: data.password})});
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchGetUser = createAsyncThunk<IGetUserResponse>(
    "user/fetchGetUser",
    async (_, { rejectWithValue }) => {
        try {
            return await requestWithAuth("auth/user", {headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem("accessToken")
                }})
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchPatchUser = createAsyncThunk<IGetUserResponse, IPatchUserRequest>(
    "user/fetchPatchUser",
    async (data, { rejectWithValue }) => {
        try {
            const reqData = {name: data.name, email: data.email, ...(data.password!== '' && { password: data.password })};
            return await requestWithAuth("auth/user", {method: "PATCH",headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem("accessToken")
                }, body: JSON.stringify(reqData)})
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export interface IUserSlice {
    user: IUser;
    isResettingPassword: boolean;
    isLoggedIn: boolean;
    status: string;
    error: string | unknown;
}

const initialState: IUserSlice = {
    user: {
        email: '',
        name: ''
    },
    isResettingPassword: false,
    isLoggedIn: false,
    status: '',
    error: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetUser.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchGetUser.fulfilled, (state, action:PayloadAction<IGetUserResponse>) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.isLoggedIn = true;
            })
            .addCase(fetchGetUser.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
                state.isLoggedIn = false;
            })
            .addCase(fetchPatchUser.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchPatchUser.fulfilled, (state, action:PayloadAction<IGetUserResponse>) => {
                state.status = "succeeded";
                state.user = action.payload.user;
            })
            .addCase(fetchPatchUser.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
            })
            .addCase(fetchLogin.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchLogin.fulfilled, (state, action:PayloadAction<ILoginResponse>) => {
                state.status = "succeeded";
                localStorage.setItem('accessToken', action.payload.accessToken.replace('Bearer ', ''));
                localStorage.setItem('refreshToken', action.payload.refreshToken);
                state.user = action.payload.user;
                state.isLoggedIn = true
            })
            .addCase(fetchLogin.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
                state.isLoggedIn = false;
            })
            .addCase(fetchLogout.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchLogout.fulfilled, (state) => {
                state.status = "succeeded";
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                state.user = initialState.user;
                state.isResettingPassword = initialState.isResettingPassword;
                state.isLoggedIn = initialState.isLoggedIn;
                state.status = initialState.status;
                state.error = initialState.error;
            })
            .addCase(fetchLogout.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
            })
            .addCase(fetchResetPassword.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchResetPassword.fulfilled, (state) => {
                state.status = "succeeded";
                state.isResettingPassword = false;
            })
            .addCase(fetchResetPassword.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchForgotPassword.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchForgotPassword.fulfilled, (state) => {
                state.status = "succeeded";
                state.isResettingPassword = true;
            })
            .addCase(fetchForgotPassword.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchRegister.fulfilled, (state, action:PayloadAction<IRegisterResponse>) => {
                state.status = "succeeded";
                localStorage.setItem('accessToken', action.payload.accessToken.replace('Bearer ', ''));
                localStorage.setItem('refreshToken', action.payload.refreshToken);
                state.user = action.payload.user;
                state.isLoggedIn = true

            })
            .addCase(fetchRegister.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
                state.isLoggedIn = false;
            })
    }
});