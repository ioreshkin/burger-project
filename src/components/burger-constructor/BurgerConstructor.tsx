import styles from './burger-constructor.module.css';
import {Button, ConstructorElement, CurrencyIcon, DragIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {IIngredient} from "../burger-ingredients-item/BurgerIngredientsItem.tsx";
import React from "react";
import { selected } from '../../App.tsx';


interface MyComponentProps {
    data: IIngredient[];
    selected: selected;
    setModal: React.Dispatch<React.SetStateAction<string>>;
}

const BurgerConstructor = ({data, selected, setModal} : MyComponentProps) => {

    const [bun, setBun] = React.useState<IIngredient>();

    const [filling, setFilling] = React.useState<IIngredient[]>([]);

    const [cost, setCost] = React.useState(0);

    React.useEffect(() => {
        let newCost = 0;
        if (data.length > 0) {
            if (selected.bun !== '') {
                const bun = data.filter(item => {
                    if (item._id === selected.bun) return item;
                });
                if (bun) {
                    setBun(bun[0]);
                    newCost += bun[0].price * 2;
                }
            }

            if (selected.filling.length > 0) {
               const newFilling : IIngredient[] = [];

                selected.filling.map(fillingItem => {
                    data.map(dataItem => {
                        if (dataItem._id === fillingItem.id) {
                            newFilling.push(dataItem);
                            newCost += dataItem.price;
                        }
                    })
                });
                setFilling(newFilling);
                setCost(newCost);
            }
        }

    }, [data, selected]);

    return (
        <section className="mt-25 pr-4 pl-4">
            <div className={`${styles.external_container} mb-4 pr-8`}>
                {bun === undefined ? <ConstructorElement
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
                {filling.map(ingredient => {
                    return <div className={styles.container} key={ingredient._id}>
                        <DragIcon type="primary" className={styles.drag}/>
                        <ConstructorElement
                            text={ingredient.name}
                            price={ingredient.price}
                            thumbnail={ingredient.image}
                            extraClass="ml-3 pr-2"
                        />
                    </div>
                })}
            </div>

            <div className={`${styles.external_container} mt-4 mb-10 pr-8`}>
                {bun === undefined ? <ConstructorElement
                    type="top"
                    isLocked={true}
                    text="Выберите булку для бургера"
                    price={0}
                    thumbnail=""
                    extraClass="ml-8 pr-6"
                /> : <ConstructorElement
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
                <Button htmlType="button" type="primary" size="large" onClick={() => setModal('order')}>
                    Оформить заказ
                </Button>
            </div>
        </section>
    );
};

export default BurgerConstructor;