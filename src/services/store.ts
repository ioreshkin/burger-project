import {combineSlices, configureStore} from '@reduxjs/toolkit';
import {websocketMiddleware} from "./websocketMiddleware.ts";
import {
    feedConnect,
    feedDisconnect,
    feedOnMessage,
    profileConnect,
    profileDisconnect,
    profileOnMessage
} from "./actions.ts";
import {burgerConstructorSlice} from "./burgerConstructorSlice.ts";
import {ingredientDetailsSlice} from "./ingredientDetailsSlice.ts";
import {ingredientSlice} from "./ingredientsSlice.ts";
import {ordersFeedSlice} from "./ordersFeedSlice.ts";
import {profileFeedSlice} from "./profileFeedSlice.ts";
import {orderSlice} from "./orderSlice.ts";
import {userSlice} from "./userSlice.ts";
import {IOrdersRequest} from "../../utils/types.ts";

const rootReducer = combineSlices(burgerConstructorSlice, ingredientDetailsSlice, ingredientSlice,
    ordersFeedSlice, profileFeedSlice, orderSlice, userSlice)

const ordersFeedMiddleware = websocketMiddleware<IOrdersRequest>({
    connect: feedConnect,
    disconnect: feedDisconnect,
    onMessage: feedOnMessage
}, false)

const profileFeedMiddleware = websocketMiddleware<IOrdersRequest>({
    connect: profileConnect,
    disconnect: profileDisconnect,
    onMessage: profileOnMessage
}, true)

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(ordersFeedMiddleware, profileFeedMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;