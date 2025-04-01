import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IOrder, IOrdersRequest} from "../../utils/types.ts";
import {profileOnMessage} from "./actions.ts";

interface IOrdersFeedSlice {
    orders: IOrder[];
}

const initialState: IOrdersFeedSlice = {
    orders: [],
};

export const profileFeedSlice = createSlice({
    name: 'profileFeed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(profileOnMessage, (state, action:PayloadAction<IOrdersRequest>) => {
                state.orders = action.payload.orders.reverse();
            })
    }
});