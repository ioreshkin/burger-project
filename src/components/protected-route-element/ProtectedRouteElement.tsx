import {Navigate, useLocation} from "react-router-dom";
import {useAppSelector} from "../../services/hooks.ts";

interface ProtectedRouteProps {
    element: React.ReactNode;
    needAuth: boolean;
}

const ProtectedRouteElement = ({ element, needAuth }: ProtectedRouteProps) => {
    const { isLoggedIn } = useAppSelector(state => state.user);
    const location = useLocation();
    const from = location.state?.from || '/';

    if (!isLoggedIn && needAuth) {
        return <Navigate to="/login" state={{ from: location.pathname}}/>;
    } else if (isLoggedIn && !needAuth) {
        return <Navigate to={ from } />;
    } else return element;
};

export default ProtectedRouteElement;