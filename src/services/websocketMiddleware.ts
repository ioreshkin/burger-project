import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';
import { refreshToken } from './request.ts';
import { RootState } from './store.ts';

type WsActions<R> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onMessage: ActionCreatorWithPayload<R>;
};

export const websocketMiddleware = <R>(
  wsActions: WsActions<R>,
  withTokenRefresh: boolean = false
): Middleware<Record<string, never>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const { connect, disconnect, onMessage } = wsActions;
    const { dispatch } = store;
    let url = '';
    return (next) => (action) => {
      if (connect.match(action)) {
        url = action.payload;
        socket = new WebSocket(action.payload);

        socket.onerror = (error) => {
          console.log('WebSocket error:', error);
        };

        socket.onmessage = (event) => {
          const { data } = event;

          try {
            const parsedData = JSON.parse(data);

            if (
              withTokenRefresh &&
              parsedData.message == 'Invalid or missing token'
            ) {
              refreshToken()
                .then((refreshedData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshedData.accessToken.replace('Bearer ', '')
                  );
                  dispatch(connect(wssUrl.toString()));
                })
                .catch((err) => {
                  console.log(err);
                });

              dispatch(disconnect());

              return;
            }

            dispatch(onMessage(parsedData));
          } catch (error) {
            console.log(error);
          }
        };
      }

      if (socket && disconnect.match(action)) {
        socket.close();
        socket = null;
      }
      next(action);
    };
  };
};
