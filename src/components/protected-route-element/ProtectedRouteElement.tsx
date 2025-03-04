
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../services/store.ts";

interface ProtectedRouteProps {
    element: React.ReactNode;
    needAuth: boolean;
}

const ProtectedRouteElement = ({ element, needAuth }: ProtectedRouteProps) => {

    const { isLoggedIn } = useSelector((state:RootState) => state.user);

    if (isLoggedIn === false && needAuth) {
        return <Navigate to="/login" state={{ from: location.pathname}}/>;
    } else if (isLoggedIn && !needAuth) {
        return (
            <Navigate to='/'/>
        )
    } else return element;
};

export default ProtectedRouteElement;