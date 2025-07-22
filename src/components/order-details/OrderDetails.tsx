import styles from './order-details.module.css';
import {useParams} from "react-router-dom";
import {useAppSelector} from "../../services/hooks.ts";
import {useEffect, useMemo, useState} from "react";
import {IIngredient, IOrder} from "../../../utils/types.ts";
import NotFoundPage from "../../pages/not-found-page/NotFoundPage.tsx";
import OrderDetailsItem from "../order-details-item/OrderDetailsItem.tsx";
import {formatRelativeDate} from "../../services/dateFormatter.ts";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";

interface MyComponentProps {
    isPrivate: boolean;
}

interface IIngredientWithCount extends IIngredient {
    count: number;
}

const OrderDetails = ({isPrivate}:MyComponentProps) => {
    const [ingredients, setIngredients] = useState<IIngredient[]>([]);
    const { items } = useAppSelector(state => state.ingredients);

    const {orderId} = useParams<{ orderId: string }>();
    const privateOrders = useAppSelector(state => state.ordersFeed.orders);
    const allOrders = useAppSelector(state => state.profileFeed.orders);
    const [order, setOrder] = useState<IOrder | undefined>();

    useEffect(() => {
        let order;
        if (isPrivate) {
            order = privateOrders.find(id => id._id === orderId);
        } else {
            order = allOrders.find(id => id._id === orderId);
        }
        setOrder(order);
    }, [privateOrders, allOrders]);

    useEffect(() => {
        if (!order) return;
        const new_arr:IIngredient[] = [];
        order.ingredients
            .forEach(id => {
                if (id) new_arr.push(items.filter(item => item._id === id)[0]);
            });
        setIngredients(new_arr);
    }, [order]);

    const processedIngredients = useMemo(() => {
        const counts: Record<string, number> = {};
        const result:IIngredientWithCount[] = [];
        let lastIngredientId: string | null = null;

        const bun = ingredients.find(ing => ing.type === 'bun');
        if (bun) {
            result.push({
                ...bun,
                count: 2
            });
            counts[bun._id] = 2;
            lastIngredientId = bun._id;
        }

        for (const ingredient of ingredients) {
            if (ingredient.type === 'bun') continue;

            if (ingredient._id === lastIngredientId) {
                const lastIndex = result.length - 1;
                result[lastIndex] = {
                    ...result[lastIndex],
                    count: (result[lastIndex].count || 1) + 1
                };
            } else {
                result.push({
                    ...ingredient,
                    count: 1
                });
                lastIngredientId = ingredient._id;
            }
        }
        return result;
    }, [ingredients]);

    const calculatePrice = (ingredients:IIngredient[]) => {
        let price = 0;
        ingredients.forEach(i => {price += i.price;});
        return price;
    }

    const getStatusText = (status:string) => {
        switch (status) {
            case 'done': return 'Выполнен';
            case 'pending': return 'Готовится';
            case 'created': return 'Создан';
        }
    }

    return order === undefined ? <NotFoundPage/> :
        <div className={styles.container}>
            <div className={`${styles.content} mt-10`}>
                <p className={`${styles.center} text text_type_digits-medium mb-10`}>#{order.number}</p>
                <p className="text text_type_main-medium mb-3">{order.name}</p>
                {order.status === 'done' ? <p className={`${styles.cyan} text text_type_main-default mt-2`}>
                    {getStatusText(order.status)}
                </p> : <p className="text text_type_main-default mt-2">
                    {getStatusText(order.status)}
                </p>}
                <p className="text text_type_main-medium mt-15 mb-6">Состав:</p>
                <div className={`${styles.ingredients} custom-scroll pr-6 mb-10`}>
                    {processedIngredients.map((ingredient, index) => (
                        ingredient &&
                        <OrderDetailsItem
                            ingredient={ingredient}
                            count={ingredient.count}
                            key={`${ingredient._id}-${index}`}
                        />
                    ))}
                </div>
                <div className={`${styles.bottom} mb-10`}>
                    <p className="text text_type_main-default text_color_inactive">
                        {formatRelativeDate(order.createdAt)}
                    </p>
                    <div className={styles.price}>
                        <p className="text text_type_digits-default mr-2">{calculatePrice(ingredients)}</p>
                        <CurrencyIcon type="primary"/>
                    </div>
                </div>
            </div>
        </div>
};

export default OrderDetails;