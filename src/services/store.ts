import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../services/ingredientsSlice.ts'
import ingredientDetailsReducer from '../services/ingredientDetailsSlice.ts';
import burgerConstructorReducer from "../services/burgerConstructorSlice.ts";
import orderReducer from '../services/orderSlice.ts';

export const store = configureStore({
    reducer: {
        ingredients: ingredientsReducer,
        ingredientDetails: ingredientDetailsReducer,
        burgerConstructor: burgerConstructorReducer,
        order: orderReducer,
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;