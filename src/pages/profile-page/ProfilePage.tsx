import styles from './profile-page.module.css';
import {
  Button,
  Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  fetchLogout,
  fetchPatchUser,
} from '../../services/slices/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks.ts';

const ProfilePage = () => {
  interface IForm {
    value: string;
    isEditing: boolean;
  }

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [nameForm, setNameForm] = useState<IForm>({
    value: '',
    isEditing: false,
  });
  const [emailForm, setEmailForm] = useState<IForm>({
    value: '',
    isEditing: false,
  });
  const [passwordForm, setPasswordForm] = useState<IForm>({
    value: '',
    isEditing: false,
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameForm({ value: user.name, isEditing: false });
    setEmailForm({ value: user.email, isEditing: false });
    setPasswordForm({ value: '', isEditing: false });
  }, []);

  const handleLogout = () => {
    dispatch(fetchLogout()).catch((error) => {
      console.log(error);
    });
  };

  const handleClose = () => {
    setNameForm({ value: user.name, isEditing: false });
    setEmailForm({ value: user.email, isEditing: false });
    setPasswordForm({ value: '', isEditing: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = await dispatch(
        fetchPatchUser({
          name: nameForm.value,
          email: emailForm.value,
          password: passwordForm.value,
        })
      ).unwrap();

      setNameForm({ value: payload.user.name, isEditing: false });
      setEmailForm({ value: payload.user.email, isEditing: false });
      setPasswordForm({ value: '', isEditing: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${styles.container} mt-30`}>
      <div className={`${styles.nav_block} mr-15`}>
        <div className={`${styles.navigation} mb-20`}>
          <div onClick={() => navigate('/profile')}>
            <p className="text text_type_main-medium">Профиль</p>
          </div>
          <div onClick={() => navigate('/profile/orders')}>
            <p className="text text_type_main-medium text_color_inactive">
              История заказов
            </p>
          </div>
          <div onClick={handleLogout}>
            <p className="text text_type_main-medium text_color_inactive">
              Выход
            </p>
          </div>
        </div>
        <p className="text text_type_main-default text_color_inactive">
          В этом разеле вы можете изменить свои персональные данные
        </p>
        <p></p>
      </div>
      <div className={styles.info_block}>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            readOnly={!nameForm.isEditing}
            placeholder="Имя"
            value={nameForm.value}
            name="name"
            size="default"
            extraClass="mt-6 mb-6"
            onChange={(e) => {
              setNameForm({ value: e.target.value, isEditing: true });
            }}
            icon={nameForm.isEditing ? 'CloseIcon' : 'EditIcon'}
            onIconClick={() => {
              if (nameForm.isEditing) {
                setNameForm({ value: user.name, isEditing: false });
              } else {
                setNameForm({ value: nameForm.value, isEditing: true });
                nameRef.current?.focus();
              }
            }}
            ref={nameRef}
          />
          <Input
            type="email"
            readOnly={!emailForm.isEditing}
            placeholder="Логин"
            value={emailForm.value}
            name="email"
            size="default"
            extraClass="mb-6"
            onChange={(e) => {
              setEmailForm({ value: e.target.value, isEditing: true });
            }}
            icon={emailForm.isEditing ? 'CloseIcon' : 'EditIcon'}
            onIconClick={() => {
              if (emailForm.isEditing) {
                setEmailForm({ value: user.email, isEditing: false });
              } else {
                setEmailForm({ value: emailForm.value, isEditing: true });
                emailRef.current?.focus();
              }
            }}
            ref={emailRef}
          />
          <Input
            type="password"
            readOnly={!passwordForm.isEditing}
            placeholder="Пароль"
            value={passwordForm.value}
            name="password"
            size="default"
            extraClass="mb-6"
            onChange={(e) => {
              setPasswordForm({ value: e.target.value, isEditing: true });
            }}
            icon={passwordForm.isEditing ? 'CloseIcon' : 'EditIcon'}
            onIconClick={() => {
              if (passwordForm.isEditing) {
                setPasswordForm({ value: '', isEditing: false });
              } else {
                setPasswordForm({ value: passwordForm.value, isEditing: true });
                passwordRef.current?.focus();
              }
            }}
            ref={passwordRef}
          />
          {(nameForm.isEditing ||
            emailForm.isEditing ||
            passwordForm.isEditing) && (
            <div className={styles.buttons_block}>
              <Button
                htmlType="button"
                type="secondary"
                size="large"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button htmlType="submit" type="primary" size="large">
                Сохранить
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
