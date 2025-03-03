
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
    element: React.ReactNode;
    needAuth: boolean;
}

const ProtectedRouteElement = ({ element, needAuth }: ProtectedRouteProps) => {
    if (localStorage.getItem('accessToken') === null && needAuth) {
        return (
            <Navigate to='/login'/>
        )
    } else if (localStorage.getItem('accessToken') !== null && !needAuth) {
        return (
            <Navigate to='/'/>
        )
    } else return element;
};

export default ProtectedRouteElement;