import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from './hooks/useAuth'
import {PrivateRoutes} from './routes/PrivateRoutes'
import {SocketProvider} from "./hooks/SocketContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SocketProvider>
                    <Routes>
                        <Route path="/*" element={<PrivateRoutes/>}/>
                    </Routes>
                </SocketProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
