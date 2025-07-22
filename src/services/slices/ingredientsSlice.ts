import { IIngredient } from '../../../utils/types.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { request } from '../request.ts';

export interface IIngredientsResponse {
  success: boolean;
  data: IIngredient[];
}

export const fetchIngredients = createAsyncThunk<IIngredientsResponse>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await request('ingredients');
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface IIngredientsSlice {
  items: IIngredient[];
  status: string;
  error: string | unknown;
}

const initialState: IIngredientsSlice = {
  items: [],
  status: '',
  error: '',
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<IIngredientsResponse>) => {
          state.status = 'succeeded';
          state.items = action.payload.data;
        }
      )
      .addCase(
        fetchIngredients.rejected,
        (state, action: PayloadAction<string | unknown>) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});
