import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { websocketMiddleware } from './websocketMiddleware.ts';
import {
  feedConnect,
  feedDisconnect,
  feedOnMessage,
  profileConnect,
  profileDisconnect,
  profileOnMessage,
} from './actions.ts';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice.ts';
import { ingredientDetailsSlice } from './slices/ingredientDetailsSlice.ts';
import { ingredientsSlice } from './slices/ingredientsSlice.ts';
import { ordersFeedSlice } from './slices/ordersFeedSlice.ts';
import { profileFeedSlice } from './slices/profileFeedSlice.ts';
import { orderSlice } from './slices/orderSlice.ts';
import { userSlice } from './slices/userSlice.ts';
import { IOrdersResponse } from '../../utils/types.ts';

const rootReducer = combineSlices(
  burgerConstructorSlice,
  ingredientDetailsSlice,
  ingredientsSlice,
  ordersFeedSlice,
  profileFeedSlice,
  orderSlice,
  userSlice
);

const ordersFeedMiddleware = websocketMiddleware<IOrdersResponse>(
  {
    connect: feedConnect,
    disconnect: feedDisconnect,
    onMessage: feedOnMessage,
  },
  false
);

const profileFeedMiddleware = websocketMiddleware<IOrdersResponse>(
  {
    connect: profileConnect,
    disconnect: profileDisconnect,
    onMessage: profileOnMessage,
  },
  true
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersFeedMiddleware, profileFeedMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
