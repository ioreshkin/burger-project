import AppHeader from "./components/app-header/AppHeader.tsx";
import {Routes, Route, useLocation, useNavigate, Navigate} from 'react-router-dom';

import MainPage from "./pages/main-page/MainPage.tsx";
import LoginPage from "./pages/login-page/LoginPage.tsx";
import RegisterPage from "./pages/register-page/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/reset-password-page/ResetPasswordPage.tsx";
import ProfilePage from "./pages/profile-page/ProfilePage.tsx";
import ProtectedRouteElement from "./components/protected-route-element/ProtectedRouteElement.tsx";
import React, {useEffect} from "react";
import {fetchGetUser} from "./services/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./services/store.ts";
import IngredientDetails from "./components/ingredient-details/IngredientDetails.tsx";
import Modal from "./components/modal/Modal.tsx";
import {reset as resetIngredientDetails} from "./services/ingredientDetailsSlice.ts";
import NotFoundPage from "./pages/not-found-page/NotFoundPage.tsx";
import {fetchIngredients} from "./services/ingredientsSlice.ts";

export type filling = {
    id: string;
    order: number;
}

export type selected = {
    bun: string;
    filling: filling[];
}


function App() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const background = location.state?.background;
    const { user } = useSelector((state:RootState) => state.user);
    const { isResettingPassword } = useSelector((state:RootState) => state.user);

    React.useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    useEffect(() => {
        if (user.name === '' && localStorage.getItem('accessToken') !== null) {
            dispatch(fetchGetUser());
        }
    }, [dispatch, user.name]);

    const handleModalClose = () => {
        // Возвращаемся к предыдущему пути при закрытии модалки
        dispatch(resetIngredientDetails());
        navigate(-1);
    };

  return (
      <>
          <AppHeader/>
          <Routes location={background || location}>
              <Route path="/" element={<MainPage />} />
              <Route path='/ingredients/:ingredientId'
                     element={<IngredientDetails />} />
              <Route path="/login" element={<ProtectedRouteElement
                  element={<LoginPage />} needAuth={false} />} />
              <Route path="/register" element={<ProtectedRouteElement
                  element={<RegisterPage />} needAuth={false} />} />
              <Route path="/forgot-password" element={<ProtectedRouteElement
                  element={<ForgotPasswordPage />} needAuth={false} />} />
              <Route path="/reset-password" element={
                  isResettingPassword ? <ProtectedRouteElement
                  element={<ResetPasswordPage />} needAuth={false} /> :
                      <Navigate to='/forgot-password' replace={false}/>} />
              <Route path="/profile" element={<ProtectedRouteElement
                  element={<ProfilePage />} needAuth={true} />} />
              <Route path='*' element={<NotFoundPage />} />
          </Routes>

          {background &&
              <Routes>
                  <Route
                      path='/ingredients/:ingredientId'
                      element={
                          <Modal onClose={handleModalClose}>
                              <IngredientDetails />
                          </Modal>
                      }
                  />
              </Routes>
         }
      </>
  )
}

export default App
