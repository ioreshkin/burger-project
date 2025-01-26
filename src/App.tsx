import styles from './app.module.css';

import AppHeader from "./components/app-header/AppHeader.tsx";
import BurgerIngredients from "./components/burger-ingredients/BurgerIngredients.tsx";
import BurgerConstructor from "./components/burger-constructor/BurgerConstructor.tsx";
import React from "react";
import {IIngredient} from "./components/burger-ingredients-item/BurgerIngredientsItem.tsx";
import Modal from "./components/modal/Modal.tsx";
import OrderDetails from "./components/order-details/OrderDetails.tsx";
import IngredientDetails from "./components/ingredients-details/IngredientDetails.tsx";

export type filling = {
    id: string;
    order: number;
}

export type selected = {
    bun: string;
    filling: filling[];
}

function App() {

    const URL = "https://norma.nomoreparties.space/api/ingredients";

    const [data, setData] = React.useState<IIngredient[]>([]);

    const [selected, setSelected] = React.useState<selected>({
        bun: '',
        filling: [{
            id: '',
            order: 0,
        }],
    });

    const [modal, setModal] = React.useState('');

    const [currentIngredient, setCurrentIngredient] = React.useState<IIngredient>({
        _id: '',
        name: '',
        type: '',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_mobile: '',
        image_large: '',
        __v: 0
    });

    React.useEffect(() => {
        const req = async () => await fetch(URL)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    return Promise.reject(`Ошибка ${res.statusText}`);
                }
            })
            .then(data => setData(data.data))
            .catch(err => console.log(err));

        req();

    }, [])

    React.useEffect(() => {
        let bunId = '';

        const fillingArr : filling[] = []

        if (data.length > 0) {
            const buns = data.filter(item => {
                if (item.type === 'bun') {
                    return item;
                }
            });
            bunId = buns[Math.round(Math.random() * (buns.length - 1))]._id;

            const num = Math.round(Math.random() * (data.length - buns.length)) + buns.length;
            let tmp = 0
            for (let i = 0; i < num; i++) {
                if (data[i].type === 'bun') {
                    tmp += 1;
                    continue;
                }

                fillingArr.push({
                    id: data[i]._id,
                    order: i - tmp + 1,
                })
            }
        }

        setSelected({
            bun: bunId,
            filling: fillingArr,
        })

    }, [data]);

    const modalOverlayClickHandler = (e:React.SyntheticEvent<HTMLElement>) => {
        if (!e.target.id) return;
        if (e.target.id === 'modal-overlay') setModal('');
        e.stopPropagation();
    }

    const closeModal = () => {
        setModal('');
    }

    const openIngredientModal = (ingredient: IIngredient)=> {
        setCurrentIngredient(ingredient);
        setModal('ingredient');
    }

  return (
      <>
          <AppHeader/>
          <div className={styles.content_container}>
              <BurgerIngredients
                  data={data} selected={selected} onClick={openIngredientModal}
              />
              <BurgerConstructor
                  data={data} selected={selected} setModal={setModal}
              />
          </div>
          <Modal overlayClickHandler={modalOverlayClickHandler} modal={modal} closeModal={closeModal} >{
              modal === 'order' &&
              <OrderDetails/>
          }
          {
              modal === 'ingredient' &&
              <IngredientDetails ingredient={currentIngredient}/>
          }
          </Modal>

      </>
  )
}

export default App
