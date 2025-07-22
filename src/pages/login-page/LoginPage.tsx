import React, { useState } from 'react';
import styles from './login-page.module.css';
import {
  Button,
  Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchLogin } from '../../services/slices/userSlice.ts';
import { useAppDispatch } from '../../services/hooks.ts';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(fetchLogin({ email: email, password: password }))
      .then(() => {
        navigate(from ? from : '/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content_wrap}>
        <form onSubmit={handleSubmit}>
          <p className={`${styles.header} text text_type_main-medium`}>Вход</p>
          <Input
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            size="default"
            extraClass="mt-6 mb-6"
          />
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            size="default"
            extraClass="mb-6"
            icon={isPasswordVisible ? 'HideIcon' : 'ShowIcon'}
            onIconClick={() => setPasswordVisible(!isPasswordVisible)}
          />
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            extraClass={styles.submit_button}
          >
            Войти
          </Button>
        </form>
        <p
          className={`${styles.block} text text_type_main-default text_color_inactive mt-20 mb-4`}
        >
          Вы - новый пользователь?{' '}
          <Link to="/register" className={styles.link} replace={false}>
            Зарегистрироваться
          </Link>
        </p>
        <p
          className={`${styles.block} text text_type_main-default text_color_inactive`}
        >
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
