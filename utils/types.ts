export interface IIngredient {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export interface IConstructorIngredient extends IIngredient {
    key: string;
    index: number;
}

export interface IUser {
    email: string;
    name: string;
}

export interface IOrder {
    _id: string;
    status: string;
    name: string;
    ingredients: string[];
    number: number;
    createdAt: string;
    updatedAt: string;
}

export interface IOrdersResponse {
    success: boolean;
    orders: IOrder[];
    total: number;
    totalToday: number;
}