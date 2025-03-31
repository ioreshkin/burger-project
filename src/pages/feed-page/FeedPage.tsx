import styles from './feed-page.module.css';
import {useAppDispatch, useAppSelector} from "../../services/hooks.ts";
import {useEffect, useState} from "react";
import OrdersItem from "../../components/orders-item/OrdersItem.tsx";
import {feedConnect, feedDisconnect} from "../../services/actions.ts";


const FeedPage = () => {
    const { orders, today, total } = useAppSelector(state => state.ordersFeed);
    const [done, setDone] = useState<number[]>([]);
    const [pending, setPending] = useState<number[]>([]);
    const dispatch = useAppDispatch();
    const URL = 'wss://norma.nomoreparties.space/orders/all'

    useEffect(() => {
        dispatch(feedConnect(URL));

        return () => {
            dispatch(feedDisconnect());
        };
    }, []);

    useEffect(() => {
        const newDone:number[] = [];
        const newPending:number[] = [];
        orders.forEach(o => {
            if (newDone.length < 20) {
                if (o.status === 'done') {
                    newDone.push(o.number);
                }
                return;
            }

            if (newPending.length < 20) {
                if (o.status === 'pending') {
                    newPending.push(o.number);
                }
            }

        });
        setDone(newDone);
        setPending(newPending);
    }, [orders]);

    return (
        <div className={`${styles.content_box} mt-5`}>
            <p className="text text_type_main-large mb-6">
                Лента заказов
            </p>
            <div className={styles.flex_box}>
                <div className={`${styles.orders} custom-scroll pr-2`}>
                    {orders.map((order) => (
                        <OrdersItem order={order} key={order.number}/>
                    ))}
                </div>

                <div className={`${styles.stats} ml-15`}>
                    <div className={`${styles.statuses} mb-15`}>
                        <div>
                            <p className="text text_type_main-medium">Готовы:</p>
                            <div className={`${styles.numbers} mt-6`}>
                                <div className={styles.numbers_column}>
                                    {done.slice(0, 10).map(item => <p
                                        className={`${styles.cyan} text text_type_digits-default mb-2`}
                                        key={item}>{item}</p>)}
                                </div>
                                <div className={styles.numbers_column}>
                                    {done.slice(10).map(item => <p
                                        className={`${styles.cyan} text text_type_digits-default mb-2`}
                                        key={item}>{item}</p>)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text text_type_main-medium mb-6">В работе:</p>
                            <div className={`${styles.numbers} mt-6`}>
                                <div className={styles.numbers_column}>
                                    {pending.slice(0, 10).map(item => <p
                                        className="text text_type_digits-default">{item}</p>)}
                                </div>
                                <div className={styles.numbers_column}>
                                    {pending.slice(10).map(item => <p
                                        className="text text_type_digits-default">{item}</p>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.stats_container} mb-15`}>
                        <p className="text text_type_main-medium">Выполнено за всё время:</p>
                        <p className={`${styles.neon} text text_type_digits-large`}>{total}</p>
                    </div>

                    <div className={`${styles.stats_container} mb-15`}>
                        <p className="text text_type_main-medium">Выполнено за сегодня:</p>
                        <p className={`${styles.neon} text text_type_digits-large`}>{today}</p>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default FeedPage;