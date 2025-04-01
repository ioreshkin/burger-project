import styles from "./main-page.module.css";
import BurgerIngredients from "../../components/burger-ingredients/BurgerIngredients.tsx";
import BurgerConstructor from "../../components/burger-constructor/BurgerConstructor.tsx";
import Modal from "../../components/modal/Modal.tsx";
import OrderCreated from "../../components/order-created/OrderCreated.tsx";
import {reset as resetOrder} from "../../services/orderSlice.ts";
import {useAppDispatch, useAppSelector} from "../../services/hooks.ts";

const MainPage = () => {

    const dispatch = useAppDispatch();

    const orderNum  = useAppSelector(state => state.order.number)

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
                    <OrderCreated/>
                </Modal>
            }

        </>
    );
};

export default MainPage;