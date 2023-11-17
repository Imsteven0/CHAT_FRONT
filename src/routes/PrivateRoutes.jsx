import {Navigate, Route, Routes} from 'react-router-dom';
import Home from "../pages/conversation/Home";
import {useAuth} from '../hooks/useAuth'
import LoginForm from "../pages/autentication/LoginForm";
import RegisterForm from "../pages/autentication/RegisterForm";
import {compareDates} from "../helpers/compareDates";

export const PrivateRoutes = () => {

    const {user, expiresIn, logout} = useAuth()
    if (!compareDates(expiresIn)) {
        logout();
    }
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/"/> : <LoginForm/>}/>
            <Route path="/register" element={user ? <Navigate to="/"/> : <RegisterForm/>}/>

                <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>}/>

        </Routes>
    );
};
