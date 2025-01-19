import styles from './burger-ingredients-item.module.css';
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";

export interface IIngredient {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

interface MyComponentProps {
    ingredient: IIngredient
}

const BurgerIngredientsItem = ({ingredient} : MyComponentProps) => {
    return (
        <div className={styles.container}>
            <img src={ingredient.image} alt={ingredient.name} className="ml-4 mr-4 mb-1"/>
            <div className={`${styles.price} mb-1`}>
                <p className="text text_type_digits-default">{ingredient.price}</p>
                <CurrencyIcon type="primary"/>
            </div>
            <p className="text text_type_main-default">{ingredient.name}</p>
            <Counter count={1} size="default" />
        </div>
    );
};

export default BurgerIngredientsItem;