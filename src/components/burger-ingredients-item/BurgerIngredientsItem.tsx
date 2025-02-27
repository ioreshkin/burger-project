import styles from './burger-ingredients-item.module.css';
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {IIngredient} from "../../../utils/types.ts";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../services/store.ts";
import { set } from "../../services/ingredientDetailsSlice.ts";
import {useDrag} from "react-dnd";

interface MyComponentProps {
    ingredient: IIngredient;
    count: number;
}

const BurgerIngredientsItem = ({ingredient, count} : MyComponentProps) => {

    const dispatch = useDispatch<AppDispatch>();

    const [, drag] = useDrag(() => ({
        type: 'ingredient',
        item: ingredient
    }));

    const handleClick = () => {
        dispatch(set(ingredient));
    }

    return (
        <div className={styles.container} onClick={handleClick} ref={drag}>
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