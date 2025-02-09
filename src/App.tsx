import styles from './app.module.css';

import AppHeader from "./components/app-header/AppHeader.tsx";
import BurgerIngredients from "./components/burger-ingredients/BurgerIngredients.tsx";
import BurgerConstructor from "./components/burger-constructor/BurgerConstructor.tsx";
import React from "react";
import Modal from "./components/modal/Modal.tsx";
import OrderDetails from "./components/order-details/OrderDetails.tsx";
import IngredientDetails from "./components/ingredient-details/IngredientDetails.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./services/store.ts";
import {fetchIngredients} from "./services/ingredientsSlice.ts";

import {IIngredient} from "../utils/types.ts";
import {reset as resetOrder} from "./services/orderSlice.ts";
import {reset as resetIngredientDetails} from "./services/ingredientDetailsSlice.ts";


export type filling = {
    id: string;
    order: number;
}

export type selected = {
    bun: string;
    filling: filling[];
}

function App() {

    const dispatch = useDispatch<AppDispatch>();

    const orderNum  = useSelector((state:RootState) => state.order.number)

    const currentIngredient:IIngredient  = useSelector((state:RootState) => state.ingredientDetails.current);

    React.useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    const onClose = () => {
        dispatch(resetOrder());
        dispatch(resetIngredientDetails());
    }

  return (
      <>
          <AppHeader/>
          <div className={styles.content_container}>
              <BurgerIngredients />
              <BurgerConstructor />
          </div>
          <Modal onClose={onClose}>{
              orderNum > 0 &&
              <OrderDetails/>
          }
          {
              currentIngredient._id !== "" &&
              <IngredientDetails ingredient={currentIngredient}/>
          }
          </Modal>
      </>
  )
}

export default App
