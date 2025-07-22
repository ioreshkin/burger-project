import { describe, expect, it } from 'vitest';
import { profileFeedSlice } from './profileFeedSlice.ts';
import { profileOnMessage } from '../actions';
import {IOrder, IOrdersResponse} from "../../../utils/types.ts";

describe('profileFeedSlice', () => {
    const initialState = profileFeedSlice.getInitialState();

    const mockOrder1: IOrder = {
        _id: 'order1',
        ingredients: ['ing1', 'ing2'],
        status: 'created',
        name: 'First Order',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        number: 1
    };

    const mockOrder2: IOrder = {
        _id: 'order2',
        ingredients: ['ing3', 'ing4'],
        status: 'done',
        name: 'Second Order',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        number: 2
    };

    describe('extraReducers', () => {
        it('should reverse orders when profileOnMessage is received', () => {
            const mockResponse: IOrdersResponse = {
                orders: [mockOrder1, mockOrder2],
                success: true,
                total: 100,
                totalToday: 10
            };

            const action = {
                type: profileOnMessage.type,
                payload: mockResponse
            };

            const state = profileFeedSlice.reducer(initialState, action);

            expect(state.orders).toEqual([mockOrder2, mockOrder1]);
        });

        it('should handle empty orders array', () => {
            const emptyResponse: IOrdersResponse = {
                orders: [],
                success: true,
                total: 0,
                totalToday: 0
            };

            const action = {
                type: profileOnMessage.type,
                payload: emptyResponse
            };

            const state = profileFeedSlice.reducer(initialState, action);

            expect(state.orders).toEqual([]);
        });

        it('should completely replace previous orders', () => {
            const firstState = profileFeedSlice.reducer(initialState, {
                type: profileOnMessage.type,
                payload: {
                    orders: [mockOrder1],
                    success: true
                }
            });

            const action = {
                type: profileOnMessage.type,
                payload: {
                    orders: [mockOrder2],
                    success: true
                }
            };

            const state = profileFeedSlice.reducer(firstState, action);

            expect(state.orders).toEqual([mockOrder2]);
        });
    });
});