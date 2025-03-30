import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import ingredientsReducer from '../services/ingredientsSlice.ts'
import ingredientDetailsReducer from '../services/ingredientDetailsSlice.ts';
import burgerConstructorReducer from "../services/burgerConstructorSlice.ts";
import orderReducer from '../services/orderSlice.ts';
import userReducer from '../services/userSlice.ts';
import ordersFeedAllReducer from './ordersFeedAllSlice.ts';
import ordersFeedReducer from './ordersFeedSlice.ts';

export const store = configureStore({
    reducer: {
        ingredients: ingredientsReducer,
        ingredientDetails: ingredientDetailsReducer,
        burgerConstructor: burgerConstructorReducer,
        order: orderReducer,
        user: userReducer,
        ordersFeedAll: ordersFeedAllReducer,
        ordersFeed: ordersFeedReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;