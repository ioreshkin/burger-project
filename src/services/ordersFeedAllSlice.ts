import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {BASE_URL} from "../../utils/constants.ts";
import {AppThunk} from "./store.ts";
import {IOrder, IOrdersRequest} from "../../utils/types.ts";


interface IOrdersFeedAllSlice {
    isConnected: boolean;
    orders: IOrder[];
    error: string | null;
    total: number;
    today: number;
}

const initialState: IOrdersFeedAllSlice = {
    isConnected: false,
    orders: [],
    error: null,
    total: 0,
    today: 0
};

let socket: WebSocket | null = null;

const ordersFeedAllSlice = createSlice({
    name: 'ordersFeedAll',
    initialState,
    reducers: {
        connectionEstablished: (state) => {
            state.isConnected = true;
            state.error = null;
        },
        connectionClosed: (state) => {
            state.isConnected = false;
        },
        connectionError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        ordersReceived: (state, action: PayloadAction<IOrdersRequest>) => {
            state.orders = action.payload.orders;
            state.total = action.payload.total;
            state.today = action.payload.totalToday;
        }
    },
});

export const {
    connectionEstablished,
    connectionClosed,
    connectionError,
    ordersReceived
} = ordersFeedAllSlice.actions;

export const connectOrdersFeedAll = (): AppThunk => (dispatch) => {
    if (socket !== null) {
        socket.close();
    }

    socket = new WebSocket(BASE_URL + 'orders/all');

    socket.onopen = () => {
        dispatch(connectionEstablished());
    };

    socket.onclose = () => {
        dispatch(connectionClosed());
    };

    socket.onerror = () => {
        dispatch(connectionError('WebSocket error occurred'));
    };

    socket.onmessage = (event) => {
        const data:IOrdersRequest = JSON.parse(event.data);
        dispatch(ordersReceived(data));
    };
};

export const disconnectOrdersFeedAll = (): AppThunk => (dispatch) => {
    if (socket) {
        socket.close();
        socket = null;
        dispatch(connectionClosed());
    }
};

export default ordersFeedAllSlice.reducer;