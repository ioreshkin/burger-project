import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IOrder, IOrdersResponse} from "../../../utils/types.ts";
import {feedOnMessage} from "../actions.ts";

export interface IOrdersFeedSlice {
    orders: IOrder[];
    today: number;
    total: number;
}

const initialState: IOrdersFeedSlice = {
    orders: [],
    today: 0,
    total: 0
};

export const ordersFeedSlice = createSlice({
    name: 'ordersFeed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(feedOnMessage, (state, action:PayloadAction<IOrdersResponse>) => {
                state.orders = action.payload.orders;
                state.today = action.payload.totalToday;
                state.total = action.payload.total;
            })
    }
});