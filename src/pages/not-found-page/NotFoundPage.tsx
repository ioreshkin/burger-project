import styles from './not-found-page.module.css';

const NotFoundPage = () => {
    return (
        <div className={`${styles.container} mt-30`}>
            <p className="text text_type_digits-large">
                404
            </p>
            <p className="text text_type_main-medium">
                Страница не найдена
            </p>
        </div>
    );
};

export default NotFoundPage;