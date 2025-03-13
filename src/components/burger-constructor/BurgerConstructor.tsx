import styles from './burger-constructor.module.css';
import {Button, ConstructorElement, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import React from "react";
import {fetchOrder} from "../../services/orderSlice.ts";
import { useDrop} from "react-dnd";
import { IIngredient} from "../../../utils/types.ts";
import {addFilling, reset, setBun} from "../../services/burgerConstructorSlice.ts";
import BurgerConstructorDraggableItem from "../burger-constructor-draggable-item/BurgerConstructorDraggableItem.tsx";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../services/hooks.ts";

const BurgerConstructor = () => {
    const { bun, filling } = useAppSelector(state => state.burgerConstructor);
    const { user } = useAppSelector(state => state.user);
    const [cost, setCost] = React.useState(0);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [, drop] = useDrop(() => ({
        accept: 'ingredient',
        drop: (item: IIngredient) => {
            if (item.type === "bun") {
                dispatch(setBun(item));
            } else {
                dispatch(addFilling(item));
            }
        },
    }));

    React.useEffect(() => {
        let newCost = 0;

        newCost += bun.price * 2;

        filling.map(item => newCost += item.price);

        setCost(newCost);

    }, [bun, filling])

    const handleClick = async () => {

        if (user.name === '') {
            navigate('/login');
        } else {
            const ids = [];
            ids.push(bun._id);
            filling.map(item => ids.push(item._id));
            ids.push(bun._id);

            dispatch(fetchOrder({ingredients: ids})).then(
                () => dispatch(reset())
            );
        }


    }

    return (
        <section className="mt-25 pr-4 pl-4" ref={drop} >
            <div className={`${styles.external_container} mb-4 pr-8`}>
                {bun._id === '' ? <ConstructorElement
                    type="top"
                    isLocked={true}
                    text="Выберите булку для бургера"
                    price={0}
                    thumbnail=""
                    extraClass="ml-8"
                /> : <ConstructorElement
                    type="top"
                    isLocked={true}
                    text={bun.name + " (верх)"}
                    price={bun.price}
                    thumbnail={bun.image}
                    extraClass="ml-8"
                />}

            </div>
            <div className={`${styles.scroll_container} custom-scroll`}>
                {filling.map((ingredient, index) => {
                    return <BurgerConstructorDraggableItem ingredient={ingredient} index={index} key={index} />
                })}
            </div>

            <div className={`${styles.external_container} mt-4 mb-10 pr-8`}>
                {bun._id === '' ? null : <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text={bun.name + " (низ)"}
                    price={bun.price}
                    thumbnail={bun.image}
                    extraClass="ml-8 pr-6"
                />}
            </div>
            <div className={styles.pay}>
                <div className={`${styles.price} mr-10`}>
                    <p className="text text_type_digits-medium">{cost}</p>
                    <CurrencyIcon type="primary" />
                </div>
                <Button htmlType="button" type="primary" size="large" onClick={handleClick}>
                    Оформить заказ
                </Button>
            </div>
        </section>
    );
};

export default BurgerConstructor;