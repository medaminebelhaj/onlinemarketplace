import { createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../models/basket";



interface BasketState {
    basket: Basket | null
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setBasket: (state, action) => {
            console.log("New basket state", action.payload);
            state.basket = action.payload;
        },
        clearBasket: (state) => {
            console.log("Basket cleared");
            state.basket = null; // Reset basket state to null
        },
    },
});

export const { setBasket, clearBasket } = basketSlice.actions;