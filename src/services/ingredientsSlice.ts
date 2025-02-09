import {IIngredient} from "../../utils/types.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const URL = "https://norma.nomoreparties.space/api/ingredients";

interface IIngredientsResponse {
    success: boolean;
    data: IIngredient[];
}

export const fetchIngredients = createAsyncThunk<IIngredientsResponse>(
    "ingredients/fetchIngredients",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(URL);
            if (!res.ok) {
                throw new Error("Ошибка при получении списка ингредиентов");
            }
            return await res.json();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
)

interface IIngredientsSlice {
    items: IIngredient[];
    status: string;
    error: string | unknown;
}

const initialState: IIngredientsSlice = {
    items: [],
    status: "",
    error: ""
}

const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.status = "loading";
                state.error = "";
            })
            .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<IIngredientsResponse>) => {
                state.status = "succeeded";
                state.items = action.payload.data;
            })
            .addCase(fetchIngredients.rejected, (state, action:PayloadAction<string | unknown>) => {
                state.status = "failed";
                state.error = action.payload;
            })
    }
});

export default ingredientSlice.reducer;