import { describe, expect, it } from 'vitest';
import { ordersFeedSlice, IOrdersFeedSlice } from './ordersFeedSlice.ts';
import { feedOnMessage } from '../actions';
import {IOrdersResponse, IOrder} from "../../../utils/types.ts";

describe('ordersFeedSlice', () => {
    const initialState: IOrdersFeedSlice = {
        orders: [],
        today: 0,
        total: 0
    };

    const mockOrder: IOrder = {
        _id: 'order1',
        ingredients: ['ing1', 'ing2'],
        status: 'created',
        name: 'Test Order',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        number: 1
    };

    const mockOrdersResponse: IOrdersResponse = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10,
        success: true
    };

    describe('extraReducers', () => {
        it('should update state when feedOnMessage is received', () => {
            const action = {
                type: feedOnMessage.type,
                payload: mockOrdersResponse
            };

            const state = ordersFeedSlice.reducer(initialState, action);

            expect(state).toEqual({
                orders: [mockOrder],
                total: 100,
                today: 10
            });
        });

        it('should handle empty orders array', () => {
            const emptyRequest: IOrdersResponse = {
                ...mockOrdersResponse,
                orders: [],
                total: 0,
                totalToday: 0
            };

            const action = {
                type: feedOnMessage.type,
                payload: emptyRequest
            };

            const state = ordersFeedSlice.reducer(initialState, action);

            expect(state).toEqual({
                orders: [],
                total: 0,
                today: 0
            });
        });

        it('should replace previous orders completely', () => {
            const firstState = ordersFeedSlice.reducer(initialState, {
                type: feedOnMessage.type,
                payload: {
                    ...mockOrdersResponse,
                    orders: [{ ...mockOrder, _id: 'order1' }]
                }
            });

            const action = {
                type: feedOnMessage.type,
                payload: {
                    ...mockOrdersResponse,
                    orders: [{ ...mockOrder, _id: 'order2' }],
                    total: 200,
                    totalToday: 20
                }
            };

            const state = ordersFeedSlice.reducer(firstState, action);

            expect(state).toEqual({
                orders: [{ ...mockOrder, _id: 'order2' }],
                total: 200,
                today: 20
            });
        });
    });
});