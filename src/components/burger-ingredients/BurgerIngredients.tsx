import styles from './burger-ingredients.module.css';
import React, {SyntheticEvent} from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import BurgerIngredientsItem from "../burger-ingredients-item/BurgerIngredientsItem.tsx";
import {IIngredient} from "../../../utils/types.ts";
import {useAppSelector} from "../../services/hooks.ts";

const BurgerIngredients = () => {
    const [current, setCurrent] = React.useState('one');
    const [buns, setBuns] = React.useState<IIngredient[]>([]);
    const [mains, setMains] = React.useState<IIngredient[]>([]);
    const [sauces, setSauces] = React.useState<IIngredient[]>([]);

    const { items, status, error} = useAppSelector(state => state.ingredients);
    const { bun, filling } = useAppSelector(state => state.burgerConstructor);

    React.useEffect(() => {
        if (items.length > 0) {
            const newBuns = [] as IIngredient[];
            const newMains = [] as IIngredient[];
            const newSauces = [] as IIngredient[];

            items?.map(item => {
                switch (item.type) {
                    case 'bun':
                        newBuns.push(item);
                        break;
                    case 'main':
                        newMains.push(item);
                        break;
                    case 'sauce':
                        newSauces.push(item);
                        break;
                }
            });
            setBuns(newBuns);
            setMains(newMains);
            setSauces(newSauces);
        }
    }, [items])

    const handleScroll = (e:SyntheticEvent<HTMLDivElement>) => {
        const container = e.currentTarget
        const headers = Array.from(container.querySelectorAll("h2"));

        let closestHeading = 1;

        let minDistance = Infinity;

        for (let i = 1; i <= headers.length; i++) {
            const newDistance = Math.abs((container.scrollTop + 252) - headers[i - 1].offsetTop);
            if (newDistance < minDistance) {
                closestHeading = i;
                minDistance = newDistance;
            }
        }

        switch (closestHeading) {
            case 1: setCurrent("one"); break;
            case 2: setCurrent("two"); break;
            case 3: setCurrent("three"); break;
        }
    }

    const findCount = (id: string) => {
        let count = 0;
        if (id === bun._id) count += 2;
        count += filling.filter(item => item._id === id).length;
        return count;
    }

    return (
        <section className="mr-10">
            <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

            <div style={{display: 'flex'}}>
                <Tab value="one" active={current === 'one'} onClick={setCurrent}>
                    Булки
                </Tab>
                <Tab value="two" active={current === 'two'} onClick={setCurrent}>
                    Соусы
                </Tab>
                <Tab value="three" active={current === 'three'} onClick={setCurrent}>
                    Начинки
                </Tab>
            </div>

            <div className={`${styles.scroll_container} custom-scroll`} onScroll={handleScroll}>
                {status === "succeeded" ? (
                    <>
                        <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>

                        <div className={styles.container}>
                            {buns.map(item => {
                                return <BurgerIngredientsItem
                                    ingredient={item} count={findCount(item._id)} key={item._id}
                                />
                            })}
                        </div>

                        <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>

                        <div className={styles.container}>
                            {sauces.map(item => {
                                return <BurgerIngredientsItem
                                    ingredient={item} count={findCount(item._id)} key={item._id}
                                />
                            })}
                        </div>

                        <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>

                        <div className={styles.container}>
                            {mains.map(item => {
                                return <BurgerIngredientsItem
                                    ingredient={item} count={findCount(item._id)} key={item._id}
                                />
                            })}
                        </div>
                    </>
                ) : <>Ошибка: {error}</>}
            </div>


        </section>
    );
};

export default BurgerIngredients;