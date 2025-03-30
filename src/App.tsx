import AppHeader from "./components/app-header/AppHeader.tsx";
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';

import MainPage from "./pages/main-page/MainPage.tsx";
import LoginPage from "./pages/login-page/LoginPage.tsx";
import RegisterPage from "./pages/register-page/RegisterPage.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/reset-password-page/ResetPasswordPage.tsx";
import ProfilePage from "./pages/profile-page/ProfilePage.tsx";
import ProtectedRouteElement from "./components/protected-route-element/ProtectedRouteElement.tsx";
import React, {useEffect} from "react";
import {fetchGetUser} from "./services/userSlice.ts";
import IngredientDetails from "./components/ingredient-details/IngredientDetails.tsx";
import Modal from "./components/modal/Modal.tsx";
import {reset as resetIngredientDetails} from "./services/ingredientDetailsSlice.ts";
import NotFoundPage from "./pages/not-found-page/NotFoundPage.tsx";
import {fetchIngredients} from "./services/ingredientsSlice.ts";
import {useAppDispatch, useAppSelector} from "./services/hooks.ts";
import {connectOrdersFeedAll, disconnectOrdersFeedAll} from "./services/ordersFeedAllSlice.ts";
import FeedPage from "./pages/feed-page/FeedPage.tsx";
import {connectOrdersFeed, disconnectOrdersFeed} from "./services/ordersFeedSlice.ts";
import ProfileOrdersPage from "./pages/profile-orders-page/ProfileOrdersPage.tsx";
import OrderDetails from "./components/order-details/OrderDetails.tsx";

function App() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const background = location.state?.background;
    const {user} = useAppSelector(state => state.user);
    const {isResettingPassword} = useAppSelector(state => state.user);

    React.useEffect(() => {
        dispatch(fetchIngredients());

        dispatch(connectOrdersFeedAll());
        dispatch(connectOrdersFeed());

        return () => {
            dispatch(disconnectOrdersFeedAll());
            dispatch(disconnectOrdersFeed());
        };
    }, [dispatch]);

    useEffect(() => {
        if (user.name === '' && localStorage.getItem('accessToken') !== null) {
            dispatch(fetchGetUser());
        }
    }, [user.name]);

    const handleModalClose = () => {
        // Возвращаемся к предыдущему пути при закрытии модалки
        dispatch(resetIngredientDetails());
        navigate(-1);
    };

    return (
        <>
            <AppHeader/>
            <Routes location={background || location}>
                <Route path="/" element={<MainPage/>}/>
                <Route path='/ingredients/:ingredientId'
                       element={<IngredientDetails/>}/>
                <Route path="/login" element={<ProtectedRouteElement
                    element={<LoginPage/>} needAuth={false}/>}/>
                <Route path="/register" element={<ProtectedRouteElement
                    element={<RegisterPage/>} needAuth={false}/>}/>
                <Route path="/forgot-password" element={<ProtectedRouteElement
                    element={<ForgotPasswordPage/>} needAuth={false}/>}/>
                <Route path="/reset-password" element={
                    isResettingPassword ? <ProtectedRouteElement
                            element={<ResetPasswordPage/>} needAuth={false}/> :
                        <Navigate to='/forgot-password' replace={false}/>}/>
                <Route path="/profile" element={<ProtectedRouteElement
                    element={<ProfilePage/>} needAuth={true}/>}/>
                <Route path="/profile/orders" element={<ProtectedRouteElement
                    element={<ProfileOrdersPage/>} needAuth={true}/>}/>
                <Route path="/profile/orders/:orderId" element={<ProtectedRouteElement
                    element={<OrderDetails isPrivate={true}/>} needAuth={true}/>}/>
                <Route path="/feed" element={<FeedPage/>}/>
                <Route path='/feed/:orderId'
                       element={<OrderDetails isPrivate={false}/>}/>
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>

            {background &&
                <Routes>
                    <Route
                        path='/ingredients/:ingredientId'
                        element={
                            <Modal onClose={handleModalClose}>
                                <IngredientDetails/>
                            </Modal>
                        }
                    />
                    <Route path='/feed/:orderId'
                        element={
                            <Modal onClose={handleModalClose}>
                                <OrderDetails isPrivate={false}/>
                            </Modal>
                        }
                    />
                    <Route path="/profile/orders/:orderId"
                        element={
                            <ProtectedRouteElement element= {
                                <Modal onClose={handleModalClose}>
                                    <OrderDetails isPrivate={true}/>
                                </Modal>
                            } needAuth={true}>
                            </ProtectedRouteElement>

                        }
                    />
                </Routes>
            }
        </>
    )
}

export default App
