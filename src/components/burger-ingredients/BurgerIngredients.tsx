import styles from './burger-ingredients.module.css';
import React from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";
import BurgerIngredientsItem, {IIngredient} from "../burger-ingredients-item/BurgerIngredientsItem.tsx";
import {selected} from "../../App.tsx";

interface MyComponentProps {
    data: IIngredient[];
    selected: selected;
    onClick: (ingredient: IIngredient) => void;
}

const BurgerIngredients = ({data, selected, onClick}: MyComponentProps) => {
    const [current, setCurrent] = React.useState('one');
    const [buns, setBuns] = React.useState<IIngredient[]>([]);
    const [mains, setMains] = React.useState<IIngredient[]>([]);
    const [sauces, setSauces] = React.useState<IIngredient[]>([]);


    React.useEffect(() => {
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
    }, [data])

    const findCount = (id: string) => {
        let count = 0;
        if (id === selected.bun) count += 2;
        count += selected.filling.filter(item => item.id === id).length;
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

            <div className={`${styles.scroll_container} custom-scroll`}>
                <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>

                <div className={styles.container}>
                    {buns.map(item => {
                        return <BurgerIngredientsItem
                            ingredient={item} count={findCount(item._id)} onClick = {onClick} key={item._id}
                        />
                    })}
                </div>

                <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>

                <div className={styles.container}>
                    {sauces.map(item => {
                        return <BurgerIngredientsItem
                            ingredient={item} count={findCount(item._id)} onClick = {onClick} key={item._id}
                        />
                    })}
                </div>

                <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>

                <div className={styles.container}>
                    {mains.map(item => {
                        return <BurgerIngredientsItem
                            ingredient={item} count={findCount(item._id)} onClick = {onClick} key={item._id}
                        />
                    })}
                </div>
            </div>


        </section>
    );
};

export default BurgerIngredients;