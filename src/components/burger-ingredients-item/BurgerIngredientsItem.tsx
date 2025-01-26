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
    ingredient: IIngredient;
    count: number;
    onClick: (ingredient: IIngredient) => void
}

const BurgerIngredientsItem = ({ingredient, count, onClick} : MyComponentProps) => {
    return (
        <div className={styles.container} onClick={() => onClick(ingredient)}>
            <img src={ingredient.image} alt={ingredient.name} className="ml-4 mr-4 mb-1"/>
            <div className={`${styles.price} mb-1`}>
                <p className="text text_type_digits-default">{ingredient.price}</p>
                <CurrencyIcon type="primary"/>
            </div>
            <p className="text text_type_main-default">{ingredient.name}</p>
            {count > 0 && <Counter count={count} size="default" />}
        </div>
    );
};

export default BurgerIngredientsItem;