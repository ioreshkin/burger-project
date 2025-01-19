import styles from './app-header.module.css';
import {
    BurgerIcon,
    ListIcon,
    Logo,
    ProfileIcon
} from "@ya.praktikum/react-developer-burger-ui-components";

const AppHeader = () => {
    return (
        <header>
            <nav>
                <div className={`${styles.container} mt-4 mb-4`}>
                    <div className={`${styles.title} p-5 mr-2`}>
                        <BurgerIcon type="primary" className="mr-2"/>
                        <p className="text text_type_main-default">Конструктор</p>
                    </div>
                    <div className={`${styles.title} p-5`}>
                        <ListIcon type="secondary" className="mr-2"/>
                        <p className="text text_type_main-default text_color_inactive">Лента заказов</p>
                    </div>
                </div>
                <Logo className={styles.logo}/>
                <div className={`${styles.title} ${styles.profile} p-5`}>
                    <ProfileIcon type="secondary" className="mr-2"/>
                    <p className="text text_type_main-default text_color_inactive">Личный кабинет</p>
                </div>
            </nav>
        </header>
    );
};

export default AppHeader;