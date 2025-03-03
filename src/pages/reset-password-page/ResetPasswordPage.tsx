import React, {useState} from 'react';
import styles from "./reset-password-page.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../services/store.ts";
import {setResettingPassword} from "../../services/userSlice.ts";
import {request} from "../../services/request.ts";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [token, setToken] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setResettingPassword(false));
        request('password-reset/reset', {method: "POST",headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({token: token, password: password})}).then(res => {
            if (res.success) {
                navigate('/login');
            }}).catch(err => {
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
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder='Введите новый пароль'
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        name='password'
                        size='default'
                        extraClass="mt-6 mb-6"
                        icon={isPasswordVisible ? 'HideIcon' : 'ShowIcon'}
                        onIconClick={() => setPasswordVisible(!isPasswordVisible)}
                    />
                    <Input
                        type='text'
                        placeholder='Введите код из письма'
                        onChange={e => setToken(e.target.value)}
                        value={token}
                        name='confirmPassword'
                        size='default'
                        extraClass="mb-6"
                    />
                    <Button htmlType="submit" type="primary" size="large" extraClass={styles.submit_button}>
                        Сохранить
                    </Button>
                </form>
                <p className={`${styles.block} text text_type_main-default text_color_inactive mt-20 mb-4`}>
                    Вспомнили пароль? <Link to='/login' className={styles.link}>Войти</Link>
                </p>


            </div>
        </div>
    );
};

export default ResetPasswordPage;