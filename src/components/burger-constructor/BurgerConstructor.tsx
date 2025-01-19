import styles from './burger-constructor.module.css';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";

const BurgerConstructor = () => {
    return (
        <section className="mt-25 pr-4 pl-4">
            <div className={`${styles.container} mb-4`}>
                <ConstructorElement
                    type="top"
                    isLocked={true}
                    text="Краторная булка N-200i (верх)"
                    price={200}
                    thumbnail="https://code.s3.yandex.net/react/code/bun-02.png"
                    extraClass="ml-8"
                />
            </div>
            <div className={`${styles.scroll_container} custom-scroll`}>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Соус традиционный галактический"
                        price={50}
                        thumbnail="https://code.s3.yandex.net/react/code/sauce-03.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Мясо бессмертных моллюсков Protostomia"
                        price={1150}
                        thumbnail="https://code.s3.yandex.net/react/code/meat-02.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Сыр с астероидной плесенью"
                        price={530}
                        thumbnail="https://code.s3.yandex.net/react/code/cheese.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Сыр с астероидной плесенью"
                        price={530}
                        thumbnail="https://code.s3.yandex.net/react/code/cheese.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Сыр с астероидной плесенью"
                        price={530}
                        thumbnail="https://code.s3.yandex.net/react/code/cheese.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Сыр с астероидной плесенью"
                        price={530}
                        thumbnail="https://code.s3.yandex.net/react/code/cheese.png"
                        extraClass="ml-3"
                    />
                </div>
                <div className={styles.container}>
                    <DragIcon type="primary" className={styles.drag}/>
                    <ConstructorElement
                        text="Сыр с астероидной плесенью"
                        price={530}
                        thumbnail="https://code.s3.yandex.net/react/code/cheese.png"
                        extraClass="ml-3"
                    />
                </div>
            </div>

            <div className={`${styles.container} mt-4 mb-10`}>
                <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text="Краторная булка N-200i (низ)"
                    price={200}
                    thumbnail="https://code.s3.yandex.net/react/code/bun-02.png"
                    extraClass="ml-8"
                />
            </div>
            <div className={styles.pay}>
                <div className={`${styles.price} mr-10`}>
                    <p className="text text_type_digits-medium">1800</p>
                    <CurrencyIcon type="primary" />
                </div>
                <Button htmlType="button" type="primary" size="large">
                    Оформить заказ
                </Button>
            </div>
        </section>
    );
};

export default BurgerConstructor;