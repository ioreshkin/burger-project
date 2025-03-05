import styles from './burger-ingredients-item.module.css';
import {Counter, CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {IIngredient} from "../../../utils/types.ts";
import {useDrag} from "react-dnd";
import {Link, useLocation} from "react-router-dom";

interface MyComponentProps {
    ingredient: IIngredient;
    count: number;
}

const BurgerIngredientsItem = ({ingredient, count} : MyComponentProps) => {

    const location = useLocation();

    const [, drag] = useDrag(() => ({
        type: 'ingredient',
        item: ingredient
    }));

    return (
        <Link key={ingredient._id} to={`/ingredients/${ingredient._id}`} state={{ background: location }} className={styles.link}>
            <div className={styles.container} ref={drag}>
                <img src={ingredient.image} alt={ingredient.name} className="ml-4 mr-4 mb-1"/>
                <div className={`${styles.price} mb-1`}>
                    <p className="text text_type_digits-default">{ingredient.price}</p>
                    <CurrencyIcon type="primary"/>
                </div>
                <p className="text text_type_main-default">{ingredient.name}</p>
                {count > 0 && <Counter count={count} size="default"/>}
            </div>
        </Link>


    );
};

export default BurgerIngredientsItem;