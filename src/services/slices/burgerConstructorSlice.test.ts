import { describe, expect, it } from 'vitest';
import { burgerConstructorSlice } from './burgerConstructorSlice.ts';
import {IIngredient} from "../../../utils/types.ts";

describe('burgerConstructorSlice', () => {
    const initialState = burgerConstructorSlice.getInitialState();

    const mockBun: IIngredient = {
        _id: "bun-1",
        name: "Test Bun",
        type: "bun",
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 200,
        image: "bun.png",
        image_mobile: "bun-mobile.png",
        image_large: "bun-large.png",
        __v: 0
    };

    const mockFilling: IIngredient = {
        _id: "filling-1",
        name: "Test Filling",
        type: "main",
        proteins: 15,
        fat: 10,
        carbohydrates: 5,
        calories: 120,
        price: 100,
        image: "filling.png",
        image_mobile: "filling-mobile.png",
        image_large: "filling-large.png",
        __v: 0
    };

    describe('reducers', () => {
        it('should handle setBun', () => {
            const action = burgerConstructorSlice.actions.setBun(mockBun);
            const state = burgerConstructorSlice.reducer(initialState, action);

            expect(state.bun).toEqual({
                ...mockBun,
                key: expect.any(String),
                index: -1
            });
            expect(state.bun.key).not.toBe("");
        });

        it('should handle addFilling', () => {
            const action = burgerConstructorSlice.actions.addFilling(mockFilling);
            const state = burgerConstructorSlice.reducer(initialState, action);

            expect(state.filling).toHaveLength(1);
            expect(state.filling[0]).toEqual({
                ...mockFilling,
                key: expect.any(String),
                index: 0
            });

            // Добавляем второй ингредиент
            const secondAction = burgerConstructorSlice.actions.addFilling(mockFilling);
            const secondState = burgerConstructorSlice.reducer(state, secondAction);

            expect(secondState.filling).toHaveLength(2);
            expect(secondState.filling[1].index).toBe(1);
        });

        it('should handle removeFilling', () => {
            const addAction = burgerConstructorSlice.actions.addFilling(mockFilling);
            const stateWithFilling = burgerConstructorSlice.reducer(initialState, addAction);
            const fillingKey = stateWithFilling.filling[0].key;

            const removeAction = burgerConstructorSlice.actions.removeFilling(fillingKey);
            const stateAfterRemove = burgerConstructorSlice.reducer(stateWithFilling, removeAction);

            expect(stateAfterRemove.filling).toHaveLength(0);
        });

        it('should handle reset', () => {
            const bunAction = burgerConstructorSlice.actions.setBun(mockBun);
            const fillingAction = burgerConstructorSlice.actions.addFilling(mockFilling);

            let state = burgerConstructorSlice.reducer(initialState, bunAction);
            state = burgerConstructorSlice.reducer(state, fillingAction);

            const resetAction = burgerConstructorSlice.actions.reset();
            const resetState = burgerConstructorSlice.reducer(state, resetAction);

            expect(resetState).toEqual(initialState);
        });

        it('should handle move filling items', () => {
            // Добавляем несколько ингредиентов
            let state = initialState;
            for (let i = 0; i < 3; i++) {
                const action = burgerConstructorSlice.actions.addFilling({
                    ...mockFilling,
                    _id: `filling-${i}`
                });
                state = burgerConstructorSlice.reducer(state, action);
            }

            expect(state.filling.map(i => i._id)).toEqual(['filling-0', 'filling-1', 'filling-2']);

            const moveAction = burgerConstructorSlice.actions.move({ dragIndex: 0, hoverIndex: 1 });
            const movedState = burgerConstructorSlice.reducer(state, moveAction);

            expect(movedState.filling.map(i => i._id)).toEqual(['filling-1', 'filling-0', 'filling-2']);

            expect(movedState.filling[0].index).toBe(1);
            expect(movedState.filling[1].index).toBe(0);
            expect(movedState.filling[2].index).toBe(2);
        });

        it('should not change state when dragIndex equals hoverIndex', () => {
            const addAction = burgerConstructorSlice.actions.addFilling(mockFilling);
            const state = burgerConstructorSlice.reducer(initialState, addAction);

            const moveAction = burgerConstructorSlice.actions.move({ dragIndex: 0, hoverIndex: 0 });
            const movedState = burgerConstructorSlice.reducer(state, moveAction);

            expect(movedState).toEqual(state);
        });
    });
});