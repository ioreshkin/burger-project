import {IUser} from "../../utils/types.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { requestWithAuth} from "./request.ts";

interface IGetUserResponse {
    success: boolean,
    user: IUser
}

interface IPatchUserRequest extends IUser {
    password: string;
}

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

interface IUserSlice {
    user: IUser;
    isResettingPassword: boolean;
    status: string;
    error: string | unknown;
}

const initialState: IUserSlice = {
    user: {
        email: '',
        name: ''
    },
    isResettingPassword: false,
    status: '',
    error: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = initialState.user;
            state.isResettingPassword = initialState.isResettingPassword;
            state.status = initialState.status;
            state.error = initialState.error;
        },
        set:(state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        setResettingPassword: (state, action: PayloadAction<boolean>) => {
            state.isResettingPassword = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetUser.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchGetUser.fulfilled, (state, action:PayloadAction<IGetUserResponse>) => {
                state.status = "succeeded";
                state.user = action.payload.user;
            })
            .addCase(fetchGetUser.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.user = initialState.user;
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
    }
});

export const { reset, set, setResettingPassword } = userSlice.actions;

export default userSlice.reducer;