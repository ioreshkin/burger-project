import React, {useState} from 'react';
import styles from "./register-page.module.css";
import {Button, Input} from "@ya.praktikum/react-developer-burger-ui-components";
import {Link, useNavigate} from "react-router-dom";
import {request} from "../../services/request.ts";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../services/store.ts";
import { set as setUser } from '../../services/userSlice.ts';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            request("auth/register", {method: "POST",headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({email: email, password:password, name: name})}).then(res => {
                if (res.success) {
                    localStorage.setItem('accessToken', res.accessToken.replace('Bearer ', ''));
                    localStorage.setItem('refreshToken', res.refreshToken);
                    dispatch(setUser(res.user));
                    navigate('/');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content_wrap}>
                <form onSubmit={handleSubmit}>
                    <p className={`${styles.header} text text_type_main-medium`}>
                        Регистрация
                    </p>
                    <Input
                        type='text'
                        placeholder='Имя'
                        onChange={e => setName(e.target.value)}
                        value={name}
                        name='name'
                        size='default'
                        extraClass="mt-6 mb-6"
                    />
                    <Input
                        type='email'
                        placeholder='E-mail'
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        name='email'
                        size='default'
                        extraClass="mb-6"
                    />
                    <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder='Пароль'
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        name='password'
                        size='default'
                        extraClass="mb-6"
                        icon={isPasswordVisible ? 'HideIcon' : 'ShowIcon'}
                        onIconClick={() => setPasswordVisible(!isPasswordVisible)}
                    />
                    <Button htmlType="submit" type="primary" size="large" extraClass={styles.submit_button}>
                        Зарегистрироваться
                    </Button>
                </form>
                <p className={`${styles.block} text text_type_main-default text_color_inactive mt-20 mb-4`}>
                    Уже зарегистрированы? <Link to='/login' className={styles.link}>Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;