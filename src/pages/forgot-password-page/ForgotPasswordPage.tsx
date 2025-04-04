import React, {useState} from 'react';
import styles from "./forgot-password-page.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, useNavigate} from "react-router-dom";
import {fetchForgotPassword} from "../../services/slices/userSlice.ts";
import {useAppDispatch} from "../../services/hooks.ts";

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(fetchForgotPassword({email: email})).then(() => {
            navigate("/reset-password");
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.content_wrap}>
                <form onSubmit={handleSubmit}>
                    <p className={`${styles.header} text text_type_main-medium`}>
                        Восстановление пароля
                    </p>
                    <Input
                        type='email'
                        placeholder='Укажите e-mail'
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        name='email'
                        size='default'
                        extraClass="mt-6 mb-6"
                    />
                    <Button htmlType="submit" type="primary" size="large" extraClass={styles.submit_button}>
                        Восстановить
                    </Button>
                </form>
                <p className={`${styles.block} text text_type_main-default text_color_inactive mt-20 mb-4`}>
                    Вспомнили пароль? <Link to='/login' className={styles.link}>Войти</Link>
                </p>


            </div>
        </div>
    );
};

export default ForgotPasswordPage;