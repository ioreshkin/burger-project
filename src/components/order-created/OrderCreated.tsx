import styles from './order-created.module.css';
import markImg from '../../images/done.png';
import { useAppSelector } from '../../services/hooks.ts';

const OrderCreated = () => {
  const { number } = useAppSelector((state) => state.order);

  return (
    <div className={styles.container}>
      <p className={`${styles.neon} text text_type_digits-large mt-30`}>
        {number}
      </p>
      <p className="text text_type_main-medium mt-8">идентифекатор заказа</p>
      <img
        src={markImg}
        alt="Ваш заказ начали готовить"
        className={`${styles.mark_img} mt-15 mb-15`}
      />
      <p className="text text_type_main-default mb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive mb-30">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderCreated;
