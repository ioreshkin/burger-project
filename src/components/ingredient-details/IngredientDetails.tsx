import styles from './ingredients-details.module.css';
import {IIngredient} from "../../../utils/types.ts";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../services/store.ts";
import {useEffect, useState} from "react";
import NotFoundPage from "../../pages/not-found-page/NotFoundPage.tsx";
import {fetchIngredients} from "../../services/ingredientsSlice.ts";



const IngredientDetails = () => {

    const dispatch = useDispatch<AppDispatch>();

    const {ingredientId} = useParams<{ ingredientId: string }>();
    const ingredients: IIngredient[] = useSelector((state: RootState) => state.ingredients.items);

    const [ingredient, setIngredient] = useState<IIngredient | undefined>(undefined);

    useEffect(() => {
        if (ingredients.length === 0) {
            dispatch(fetchIngredients());
        }
        const currentIngredient = ingredients.find(i => i._id === ingredientId);
        setIngredient(currentIngredient);
    }, [ingredientId, ingredients]);

    return ingredient === undefined ? <NotFoundPage/> :
        <div className={styles.container}>
            <div className={styles.content}>
                <p className="text text_type_main-large mr-10 ml-10 mt-10">Детали ингредиента</p>
                <img src={ingredient.image_large} alt={ingredient.name}/>
                <p className="text text_type_main-medium mt-4 mb-8" style={{textAlign: 'center'}}>{ingredient.name}</p>
                <div className={`${styles.nutritional_container} mb-15`}>
                    <div>
                        <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
                        <p className="text text_type_digits-default text_color_inactive">{ingredient.calories}</p>
                    </div>
                    <div>
                        <p className="text text_type_main-default text_color_inactive">Белки, г</p>
                        <p className="text text_type_digits-default text_color_inactive">{ingredient.proteins}</p>
                    </div>
                    <div>
                        <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
                        <p className="text text_type_digits-default text_color_inactive">{ingredient.fat}</p>
                    </div>
                    <div>
                        <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
                        <p className="text text_type_digits-default text_color_inactive">{ingredient.carbohydrates}</p>
                    </div>
                </div>
            </div>

        </div>
};

export default IngredientDetails;