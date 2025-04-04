import { describe, expect, it, vi } from 'vitest';
import {
    ingredientSlice,
    fetchIngredients,
    IIngredientsSlice,
    IIngredientsResponse,
} from './ingredientsSlice.ts';
import { request } from '../request';
import {IIngredient} from "../../../utils/types.ts";

vi.mock('../request', () => ({
    request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);

describe('ingredientSlice', () => {
    const initialState: IIngredientsSlice = {
        items: [],
        status: "",
        error: ""
    };

    const mockIngredient: IIngredient = {
        _id: '1',
        name: 'Test Ingredient',
        type: 'main',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 100,
        image: 'image.png',
        image_mobile: 'image-mobile.png',
        image_large: 'image-large.png',
        __v: 0
    };

    describe('extraReducers', () => {
        it('should set status to "loading" when fetchIngredients is pending', () => {
            const action = { type: fetchIngredients.pending.type };
            const state = ingredientSlice.reducer(initialState, action);

            expect(state).toEqual({
                items: [],
                status: 'loading',
                error: '',
            });
        });

        it('should set status to "succeeded" and items when fetchIngredients is fulfilled', () => {
            const mockResponse: IIngredientsResponse = {
                success: true,
                data: [mockIngredient]
            };

            const action = {
                type: fetchIngredients.fulfilled.type,
                payload: mockResponse
            };

            const state = ingredientSlice.reducer(initialState, action);

            expect(state).toEqual({
                items: [mockIngredient],
                status: 'succeeded',
                error: '',
            });
        });

        it('should set status to "failed" and error when fetchIngredients is rejected', () => {
            const errorMessage = 'Network error';
            const action = {
                type: fetchIngredients.rejected.type,
                payload: errorMessage
            };

            const state = ingredientSlice.reducer(initialState, action);

            expect(state).toEqual({
                items: [],
                status: 'failed',
                error: errorMessage,
            });
        });
    });

    describe('fetchIngredients thunk', () => {
        it('should dispatch fulfilled when request is successful', async () => {
            const mockResponse: IIngredientsResponse = {
                success: true,
                data: [mockIngredient]
            };

            mockedRequest.mockResolvedValueOnce(mockResponse);

            const dispatch = vi.fn();
            const getState = vi.fn();

            const thunk = fetchIngredients();
            await thunk(dispatch, getState, undefined);

            const [pending, fulfilled] = dispatch.mock.calls;

            expect(pending[0].type).toEqual(fetchIngredients.pending.type);
            expect(fulfilled[0].type).toEqual(fetchIngredients.fulfilled.type);
            expect(fulfilled[0].payload).toEqual(mockResponse);
        });

        it('should dispatch rejected when request fails', async () => {
            const errorMessage = 'Network error';
            mockedRequest.mockRejectedValueOnce(new Error(errorMessage));

            const dispatch = vi.fn();
            const getState = vi.fn();

            const thunk = fetchIngredients();
            await thunk(dispatch, getState, undefined);

            const [pending, rejected] = dispatch.mock.calls;

            expect(pending[0].type).toEqual(fetchIngredients.pending.type);
            expect(rejected[0].type).toEqual(fetchIngredients.rejected.type);
            expect(rejected[0].payload).toEqual(errorMessage);
        });
    });
});