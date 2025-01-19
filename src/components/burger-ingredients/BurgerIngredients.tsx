import styles from './burger-ingredients.module.css';
import React, {useEffect} from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import result from "../../../utils/data.ts";
import BurgerIngredientsItem, {IIngredient} from "../burger-ingredients-item/BurgerIngredientsItem.tsx";

const BurgerIngredients = () => {
    const [current, setCurrent] = React.useState('one');
    const [buns, setBuns] = React.useState<IIngredient[]>([]);
    const [mains, setMains] = React.useState<IIngredient[]>([]);
    const [sauces, setSauces] = React.useState<IIngredient[]>([]);



    useEffect(() => {
        const data : IIngredient[] = result;
        const newBuns = [] as IIngredient[];
        const newMains = [] as IIngredient[];
        const newSauces = [] as IIngredient[];

        data.map(item => {
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
    }, [])

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

            <div className={`${styles.scroll_container} custom-scroll`}>
                <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>

                <div className={styles.container}>
                    {buns.map(item => {
                        return <BurgerIngredientsItem ingredient={item}/>
                    })}
                </div>

                <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>

                <div className={styles.container}>
                    {sauces.map(item => {
                        return <BurgerIngredientsItem ingredient={item}/>
                    })}
                </div>

                <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>

                <div className={styles.container}>
                    {mains.map(item => {
                        return <BurgerIngredientsItem ingredient={item}/>
                    })}
                </div>
            </div>


        </section>
    );
};

export default BurgerIngredients;