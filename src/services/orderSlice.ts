import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const URL = "https://norma.nomoreparties.space/api/orders";

interface IOrderResponse {
    name: string;
    order: {
        number: number;
    };
    success: boolean;
}

interface IOrder {
    ingredients: string[];
}

//{"ingredients": ["643d69a5c3f7b9001cfa093d", "643d69a5c3f7b9001cfa093d"]}

export const fetchOrder = createAsyncThunk<IOrderResponse, IOrder>(
    "order/fetchOrder",
    async (data, { rejectWithValue }) => {
        try {
            const res = await fetch(URL, {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(data)});
            if (!res.ok) {
                throw new Error("Ошибка при получении номера заказа");
            }
            return await res.json();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
)

interface IOrderSlice {
    number: number;
    status: string;
    error: string | unknown;
}

const initialState: IOrderSlice = {
    number: 0,
    status: '',
    error: ''
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => {
            state.number = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchOrder.fulfilled, (state, action:PayloadAction<IOrderResponse>) => {
                state.status = "succeeded";
                state.number = action.payload.order.number;
            })
            .addCase(fetchOrder.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
                state.number = initialState.number;
            })
    }
});

export const { reset } = orderSlice.actions;

export default orderSlice.reducer;