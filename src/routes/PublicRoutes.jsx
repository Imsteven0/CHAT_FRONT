import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginForm from "../pages/autentication/LoginForm";
import RegisterForm from "../pages/autentication/RegisterForm";
export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/register" element={<RegisterForm/>}/>
        </Routes>
    );
};