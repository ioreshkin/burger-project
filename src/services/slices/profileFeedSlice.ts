import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, IOrdersResponse } from '../../../utils/types.ts';
import { profileOnMessage } from '../actions.ts';

export interface IOrdersFeedSlice {
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
    builder.addCase(
      profileOnMessage,
      (state, action: PayloadAction<IOrdersResponse>) => {
        state.orders = action.payload.orders.reverse();
      }
    );
  },
});
