import {createAction} from "@reduxjs/toolkit";
import {IOrdersResponse} from "../../utils/types.ts";

export const feedConnect = createAction<string, "ordersFeed/onConnect">("ordersFeed/onConnect");
export const feedDisconnect = createAction("ordersFeed/onDisconnect");
export const feedOnMessage = createAction<IOrdersResponse>("ordersFeed/onMessage");

export const profileConnect = createAction<string, "profileFeed/onConnect">("profileFeed/onConnect");
export const profileDisconnect = createAction("profileFeed/onDisconnect");
export const profileOnMessage = createAction<IOrdersResponse>("profileFeed/onMessage");