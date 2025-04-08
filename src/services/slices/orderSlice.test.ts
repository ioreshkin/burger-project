import { describe, expect, it, vi } from 'vitest';
import { fetchOrder, orderSlice, IOrderResponse, IOrder } from './orderSlice';
import { requestWithAuth } from '../request';

vi.mock('../request', () => ({
    requestWithAuth: vi.fn(),
}));

const mockedRequestWithAuth = vi.mocked(requestWithAuth);

describe('orderSlice', () => {
    const initialState = orderSlice.getInitialState();

    describe('reducers', () => {
        it('should handle reset', () => {
            const previousState = { ...initialState, number: 12345 };
            const nextState = orderSlice.reducer(previousState, orderSlice.actions.reset());
            expect(nextState.number).toEqual(0);
        });
    });

    describe('extraReducers', () => {
        it('should set status to "loading" when fetchOrder is pending', () => {
            const action = { type: fetchOrder.pending.type };
            const state = orderSlice.reducer(initialState, action);
            expect(state).toEqual({
                number: 0,
                status: 'loading',
                error: '',
            });
        });

        it('should set status to "succeeded" and number when fetchOrder is fulfilled', () => {
            const mockResponse: IOrderResponse = {
                name: 'Order name',
                order: { number: 12345 },
                success: true,
            };
            const action = { type: fetchOrder.fulfilled.type, payload: mockResponse };
            const state = orderSlice.reducer(initialState, action);
            expect(state).toEqual({
                number: 12345,
                status: 'succeeded',
                error: '',
            });
        });

        it('should set status to "failed" and error when fetchOrder is rejected', () => {
            const errorMessage = 'Network error';
            const action = { type: fetchOrder.rejected.type, payload: errorMessage };
            const state = orderSlice.reducer(initialState, action);
            expect(state).toEqual({
                number: 0,
                status: 'failed',
                error: errorMessage,
            });
        });
    });

    describe('fetchOrder thunk', () => {
        it('should dispatch fulfilled when request is successful', async () => {
            const mockResponse: IOrderResponse = {
                name: 'Order name',
                order: { number: 12345 },
                success: true,
            };
            mockedRequestWithAuth.mockResolvedValueOnce(mockResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();
            const orderData: IOrder = { ingredients: ['ing1', 'ing2'] };

            const thunk = fetchOrder(orderData);
            await thunk(dispatch, getState, undefined);

            const [pending, fulfilled] = dispatch.mock.calls;

            expect(pending[0].type).toEqual(fetchOrder.pending.type);
            expect(fulfilled[0].type).toEqual(fetchOrder.fulfilled.type);
            expect(fulfilled[0].payload).toEqual(mockResponse);
        });

        it('should dispatch rejected when request fails', async () => {
            const errorMessage = 'Network error';
            mockedRequestWithAuth.mockRejectedValueOnce(new Error(errorMessage));

            const dispatch = vi.fn();
            const getState = vi.fn();
            const orderData: IOrder = { ingredients: ['ing1', 'ing2'] };

            const thunk = fetchOrder(orderData);
            await thunk(dispatch, getState, undefined);

            const [pending, rejected] = dispatch.mock.calls;

            expect(pending[0].type).toEqual(fetchOrder.pending.type);
            expect(rejected[0].type).toEqual(fetchOrder.rejected.type);
            expect(rejected[0].payload).toEqual(errorMessage);
        });
    });
});