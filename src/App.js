import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from './hooks/useAuth'
import {PrivateRoutes} from './routes/PrivateRoutes'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/*" element={<PrivateRoutes />}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
