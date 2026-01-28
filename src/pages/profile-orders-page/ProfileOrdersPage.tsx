import styles from './profile-orders-page.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchLogout } from '../../services/slices/userSlice.ts';
import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';
import ProfileOrdersItem from '../../components/profile-orders-item/ProfileOrdersItem.tsx';
import { useEffect } from 'react';
import { profileConnect, profileDisconnect } from '../../services/actions.ts';

const ProfileOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.profileFeed);
  const token = localStorage.getItem('accessToken');
  const URL = `wss://norma.education-services.ru/orders?token=${token}`;

  useEffect(() => {
    dispatch(profileConnect(URL));

    return () => {
      dispatch(profileDisconnect());
    };
  }, []);

  const handleLogout = () => {
    dispatch(fetchLogout()).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className={`${styles.container} mt-10`}>
      <div className={`${styles.nav_block} mr-15 mt-20`}>
        <div className={`${styles.navigation} mb-20`}>
          <div onClick={() => navigate('/profile')}>
            <p className="text text_type_main-medium text_color_inactive">
              Профиль
            </p>
          </div>
          <div onClick={() => navigate('/profile/orders')}>
            <p className="text text_type_main-medium">История заказов</p>
          </div>
          <div onClick={handleLogout}>
            <p className="text text_type_main-medium text_color_inactive">
              Выход
            </p>
          </div>
        </div>
        <p className="text text_type_main-default text_color_inactive">
          В этом разеле вы можете просмотреть свою историю заказов
        </p>
        <p></p>
      </div>
      <div className={`${styles.orders} custom-scroll pr-2`}>
        {orders.map((order) => (
          <ProfileOrdersItem order={order} key={order.number} />
        ))}
      </div>
    </div>
  );
};

export default ProfileOrdersPage;
