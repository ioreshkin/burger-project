import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";
import {IIngredient, IConstructorIngredient} from "../../utils/types.ts";

interface IBurgerConstructorSlice {
    bun: IConstructorIngredient;
    filling: IConstructorIngredient[];
}

const initialState: IBurgerConstructorSlice = {
    bun: {_id:"",
        name:"",
        type:"",
        proteins:0,
        fat:0,
        carbohydrates:0,
        calories:0,
        price:0,
        image:"",
        image_mobile:"",
        image_large:"",
        __v:0,
        key:"",
        index:-1
    },
    filling: []
}

const burgerConstructorSlice = createSlice({
    name: 'burgerConstructor',
    initialState,
    reducers: {
        setBun: (state, action: PayloadAction<IIngredient>) => {
            state.bun = {...action.payload, key: nanoid(), index: -1};
        },
        addFilling: (state, action: PayloadAction<IIngredient>) => {
            state.filling.push({...action.payload, key: nanoid(), index: state.filling.length});
        },
        removeFilling: (state, action: PayloadAction<string>) => {
            state.filling = state.filling.filter(filling => filling.key !== action.payload);
        },
        reset: (state) => {
            state.bun = initialState.bun;
            state.filling = initialState.filling;
        },
        move: (state, action:PayloadAction<{ dragIndex: number, hoverIndex:number}>) => {
            if (action.payload.dragIndex === action.payload.hoverIndex) return;
            const updatedFilling = [...state.filling];
            const [removed] = updatedFilling.splice(action.payload.dragIndex, 1);
            updatedFilling.splice(action.payload.hoverIndex, 0, removed);
            state.filling = updatedFilling;
        }
    }
});

export const { setBun, addFilling, removeFilling, reset, move } = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;