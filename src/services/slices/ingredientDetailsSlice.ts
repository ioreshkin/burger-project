import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIngredient } from '../../../utils/types.ts';

export interface IIngredientDetailsSlice {
  current: IIngredient;
}

const initialState: IIngredientDetailsSlice = {
  current: {
    _id: '',
    name: '',
    type: '',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: '',
    image_mobile: '',
    image_large: '',
    __v: 0,
  },
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<IIngredient>) => {
      state.current = action.payload;
    },
    reset: (state) => {
      state.current = initialState.current;
    },
  },
});

export const { set, reset } = ingredientDetailsSlice.actions;
