import styles from './oreder-details-item.module.css';
import {IIngredient} from "../../../utils/types.ts";
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";

interface MyComponentProps {
    ingredient: IIngredient;
    count: number;
}

const OrderDetailsItem = ({ingredient, count}: MyComponentProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.circle_image_external}>
                <div className={styles.circle_image_internal}>
                    <img src={ingredient.image} alt={ingredient.name}/>
                </div>
            </div>
            <p className={`${styles.huy} text text_type_main-default ml-4 mr-4`}>{ingredient.name}</p>
            <div className={styles.price}>
                <p className="text text_type_digits-default mr-2">{`${count} x ${ingredient.price}`}</p>
                <CurrencyIcon type="primary"/>
            </div>
        </div>
    );
};

export default OrderDetailsItem;