
import {Navigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store.ts";

interface ProtectedRouteProps {
    element: React.ReactNode;
    needAuth: boolean;
}

const ProtectedRouteElement = ({ element, needAuth }: ProtectedRouteProps) => {
    const { isLoggedIn } = useSelector((state:RootState) => state.user);
    const location = useLocation();
    const from = location.state?.from || '/';

    if (!isLoggedIn && needAuth) {
        return <Navigate to="/login" state={{ from: location.pathname}}/>;
    } else if (isLoggedIn && !needAuth) {
        return <Navigate to={ from } />;
    } else return element;
};

export default ProtectedRouteElement;