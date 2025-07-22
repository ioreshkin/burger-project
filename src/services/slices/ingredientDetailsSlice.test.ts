import { describe, expect, it } from 'vitest';
import { ingredientDetailsSlice } from './ingredientDetailsSlice.ts';
import { IIngredient } from '../../../utils/types.ts';

describe('ingredientDetailsSlice', () => {
  const initialState = ingredientDetailsSlice.getInitialState();

  const mockIngredient: IIngredient = {
    _id: 'ingredient-1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 100,
    image: 'ingredient.png',
    image_mobile: 'ingredient-mobile.png',
    image_large: 'ingredient-large.png',
    __v: 0,
  };

  describe('reducers', () => {
    it('should handle set', () => {
      const action = ingredientDetailsSlice.actions.set(mockIngredient);
      const state = ingredientDetailsSlice.reducer(initialState, action);

      expect(state.current).toEqual(mockIngredient);
    });

    it('should handle reset', () => {
      const setAction = ingredientDetailsSlice.actions.set(mockIngredient);
      const stateWithIngredient = ingredientDetailsSlice.reducer(
        initialState,
        setAction
      );

      const resetAction = ingredientDetailsSlice.actions.reset();
      const resetState = ingredientDetailsSlice.reducer(
        stateWithIngredient,
        resetAction
      );

      expect(resetState).toEqual(initialState);
    });
  });
});
