import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IOrder, IOrdersRequest} from "../../utils/types.ts";
import {feedOnMessage} from "./actions.ts";

interface IOrdersFeedSlice {
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
            .addCase(feedOnMessage, (state, action:PayloadAction<IOrdersRequest>) => {
                state.orders = action.payload.orders;
                state.today = action.payload.totalToday;
                state.total = action.payload.total;
            })
    }
});