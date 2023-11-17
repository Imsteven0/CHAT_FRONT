import React, {createContext, useContext, useState, useEffect} from 'react';
import {io} from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:8000'); // Reemplaza con la URL de tu servidor Socket.io
        setSocket(newSocket);

        return () => newSocket.disconnect(); // Desconectar el socket al desmontar el componente
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
