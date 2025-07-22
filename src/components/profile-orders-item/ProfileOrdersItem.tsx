import { useEffect, useState } from 'react';
import { IIngredient, IOrder } from '../../../utils/types.ts';
import { useAppSelector } from '../../services/hooks.ts';
import styles from './profile-orders-item.module.css';
import { formatRelativeDate } from '../../services/dateFormatter.ts';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

interface MyComponentProps {
  order: IOrder;
}

const ProfileOrdersItem = ({ order }: MyComponentProps) => {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const { items } = useAppSelector((state) => state.ingredients);
  const location = useLocation();

  useEffect(() => {
    const new_arr: IIngredient[] = [];
    order.ingredients.forEach((id) => {
      if (id) new_arr.push(items.filter((item) => item._id === id)[0]);
    });
    setIngredients(new_arr);
  }, [order]);

  const calculatePrice = (ingredients: IIngredient[]) => {
    let price = 0;
    ingredients.forEach((i) => {
      price += i.price;
    });
    return price;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
    }
  };

  return (
    <Link
      to={`/profile/orders/${order._id}`}
      state={{ background: location }}
      className={styles.link}
    >
      <div className={`${styles.container} p-6`}>
        <div className={`${styles.order_id} mb-6`}>
          <p className="text text_type_digits-default">#{order.number}</p>
          <p className="text text_type_main-default text_color_inactive">
            {formatRelativeDate(order.createdAt)}
          </p>
        </div>
        <p className="text text_type_main-medium">{order.name}</p>
        {order.status === 'done' ? (
          <p className={`${styles.cyan} text text_type_main-default mt-2`}>
            {getStatusText(order.status)}
          </p>
        ) : (
          <p className="text text_type_main-default mt-2">
            {getStatusText(order.status)}
          </p>
        )}

        <div className={`${styles.components} mt-6`}>
          <div className={styles.ingredients}>
            {ingredients.map((i, index) => {
              if (index < 5) {
                return (
                  <div
                    className={styles.circle_image_external}
                    style={{ zIndex: 6 - index }}
                    key={index}
                  >
                    <div className={styles.circle_image_internal}>
                      <img src={i.image} alt={i.name} />
                    </div>
                  </div>
                );
              } else if (index === 5) {
                return (
                  <div
                    className={styles.circle_image_external}
                    style={{ zIndex: 6 - index }}
                    key={index}
                  >
                    <div className={styles.circle_image_inactive}>
                      <div className={styles.grayBcg}></div>
                      <img src={i.image} alt={i.name} />
                      <p className="text text_type_main-small">
                        +{ingredients.length - 5}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className={styles.price}>
            <p className="text text_type_digits-default mr-2">
              {calculatePrice(ingredients)}
            </p>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileOrdersItem;
