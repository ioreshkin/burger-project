import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {BASE_URL} from "../../utils/constants.ts";
import {AppThunk} from "./store.ts";
import {request} from "./request.ts";
import {IOrder, IOrdersRequest} from "../../utils/types.ts";


interface IOrdersFeedSlice {
    isConnected: boolean;
    orders: IOrder[];
    error: string | null;
}

const initialState: IOrdersFeedSlice = {
    isConnected: false,
    orders: [],
    error: null,
};

let orderSocket: WebSocket | null = null;

const ordersFeedSlice = createSlice({
    name: 'ordersFeed',
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
        ordersReceived:  (state, action: PayloadAction<IOrder[]>) => {
            state.orders = action.payload.reverse();
        }
    },
});

export const {
    connectionEstablished,
    connectionClosed,
    connectionError,
    ordersReceived,
} = ordersFeedSlice.actions;

export const connectOrdersFeed = (): AppThunk => async (dispatch) => {
    if (orderSocket !== null) {
        orderSocket.close();
    }

    const refreshToken = async (): Promise<string | null> => {
        try {
            const res = await request("auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
            });

            if (res.success) {
                localStorage.setItem('accessToken', res.accessToken.replace('Bearer ', ''));
                localStorage.setItem('refreshToken', res.refreshToken);
            }
            return res.accessToken.replace('Bearer ', '');
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return null;
        }
    };

    // Проверяем токен перед подключением
    let token = localStorage.getItem('accessToken');
    if (!token) {
        const newToken = await refreshToken();
        if (!newToken) {
            dispatch(connectionError('Authorization required'));
            return;
        }
        token = newToken;
    }

    orderSocket = new WebSocket(`${BASE_URL}orders?token=${token}`);

    orderSocket.onopen = () => {
        dispatch(connectionEstablished());
    };

    orderSocket.onclose = async (event) => {
        if (event.code === 1006) {
            const newToken = await refreshToken();
            if (newToken) {
                dispatch(connectOrdersFeed());
                return;
            }
        }
        dispatch(connectionClosed());
    };

    orderSocket.onerror = () => {
        dispatch(connectionError('WeborderSocket error occurred'));
    };

    orderSocket.onmessage = (event) => {
        if (event.data === 'Invalid or missing token') {
            disconnectOrdersFeed(1006)
            return;
        }
        const data:IOrdersRequest = JSON.parse(event.data);

        dispatch(ordersReceived(data.orders));
    };
};

export const disconnectOrdersFeed = (code?:number): AppThunk => (dispatch) => {
    if (orderSocket) {
        orderSocket.close(code);
        orderSocket = null;
        dispatch(connectionClosed());
    }
};

export default ordersFeedSlice.reducer;