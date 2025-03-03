import React from 'react';
import styles from "./main-page.module.css";
import BurgerIngredients from "../../components/burger-ingredients/BurgerIngredients.tsx";
import BurgerConstructor from "../../components/burger-constructor/BurgerConstructor.tsx";
import Modal from "../../components/modal/Modal.tsx";
import OrderDetails from "../../components/order-details/OrderDetails.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../services/store.ts";
import {fetchIngredients} from "../../services/ingredientsSlice.ts";
import {reset as resetOrder} from "../../services/orderSlice.ts";

const MainPage = () => {

    const dispatch = useDispatch<AppDispatch>();

    const orderNum  = useSelector((state:RootState) => state.order.number)

    React.useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    const onClose = () => {
        dispatch(resetOrder());

    }

    return (
        <>
            <div className={styles.content_container}>
                <BurgerIngredients />
                <BurgerConstructor />
            </div>
            {
                orderNum > 0 && <Modal onClose={onClose}>
                    <OrderDetails/>
                </Modal>
            }

        </>
    );
};

export default MainPage;