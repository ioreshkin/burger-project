import styles from './app-header.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

const AppHeader = () => {
  const location = useLocation();
  return (
    <header>
      <nav>
        <div className={`${styles.container} mt-4 mb-4`}>
          <Link to="/">
            <div className={`${styles.title} p-5 mr-2`}>
              <BurgerIcon type="primary" className="mr-2" />
              <p
                className={`text text_type_main-default ${location.pathname != '/' && 'text_color_inactive'}`}
              >
                Конструктор
              </p>
            </div>
          </Link>

          <Link to="/feed">
            <div className={`${styles.title} p-5`}>
              <ListIcon type="secondary" className="mr-2" />
              <p
                className={`text text_type_main-default ${location.pathname != '/feed' && 'text_color_inactive'}`}
              >
                Лента заказов
              </p>
            </div>
          </Link>
        </div>
        <Link to="/">
          <Logo className={styles.logo} />
        </Link>

        <Link to="/profile">
          <div className={`${styles.title} ${styles.profile} p-5`}>
            <ProfileIcon type="secondary" className="mr-2" />
            <p
              className={`text text_type_main-default 
                        ${location.pathname !== '/login' && location.pathname !== '/profile' && 'text_color_inactive'}`}
            >
              Личный кабинет
            </p>
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default AppHeader;
