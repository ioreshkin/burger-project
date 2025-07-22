import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestWithAuth } from '../request.ts';

export interface IOrderResponse {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
}

export interface IOrder {
  ingredients: string[];
}

export const fetchOrder = createAsyncThunk<IOrderResponse, IOrder>(
  'order/fetchOrder',
  async (data, { rejectWithValue }) => {
    try {
      return await requestWithAuth('orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface IOrderSlice {
  number: number;
  status: string;
  error: string | unknown;
}

const initialState: IOrderSlice = {
  number: 0,
  status: '',
  error: '',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.number = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(
        fetchOrder.fulfilled,
        (state, action: PayloadAction<IOrderResponse>) => {
          state.status = 'succeeded';
          state.number = action.payload.order.number;
        }
      )
      .addCase(
        fetchOrder.rejected,
        (state, action: PayloadAction<string | unknown>) => {
          state.status = 'failed';
          state.error = action.payload;
          state.number = initialState.number;
        }
      );
  },
});

export const { reset } = orderSlice.actions;
