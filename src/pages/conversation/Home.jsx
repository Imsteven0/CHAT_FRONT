import React, {useEffect, useState} from "react";
import Chat from "./Chat";
import UnsetChat from "../unset/UnsetChat";
import {useAuth} from "../../hooks/useAuth";
import {compareDates} from "../../helpers/compareDates";
import HeaderChat from "./headers/HeaderChat";
import {useSocket} from "../../hooks/SocketContext";

const Home = () => {
    const {idUser, expiresIn, logout} = useAuth();
    const [data, setData] = useState([]);
    const [dataMessages, setDataMessages] = useState(null);
    const [idConversation, setIdConversation] = useState(null);
    const [UserChat, setUserChat] = useState([]);

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        // Emitir solo en el montaje del componente
        socket.emit("userConnect", {idUser: idUser});

        socket.on("userChats", async (data) => {
            setData(data);
        });

        // Escuchar mensajes nuevos
        socket.on("messageReceived", (message) => {
            setData((prevData) => {
                if (prevData && message.conversationId) {
                    return prevData.map((item) => {
                        if (item._id === message.conversationId) {
                            return {
                                ...item,
                                messages: [...item.messages, message],
                            };
                        }
                        return item;
                    });
                }
                return prevData;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    if (!compareDates(expiresIn)) {
        logout();
    }

    useEffect(() => {
        handleDataChange(data, idConversation);
    }, [data, idConversation]);

    const handleDataChange = (newData, idConversation) => {
        const conversation = newData.find((item) => item._id === idConversation);
        if (conversation) {
            setDataMessages(conversation.messages);
        }
    };

    const openConversation = (IdConversation) => {
        // Se activan los estilos para el chat activo.
        setActiveChatStyle(IdConversation);
        // Se setea id el de la conversacio global.
        setIdConversation(IdConversation);

        const conversation = data.find((item) => item._id === IdConversation);
        const userConversation = conversation.users.find(
            (item) => item._id !== idUser
        );
        if (conversation) {
            setDataMessages(conversation.messages);
        }
        if (userConversation) {
            setUserChat([userConversation]);
        }
    };

    /* Su funcion se basa en poner un estado activo a una conversacion*/
    const setActiveChatStyle = (IdConversation) => {
        data.forEach((obj, index) => {
            obj.activeChatStyle = obj._id === IdConversation ? 1 : 0;
        });
    };

    const setStyleChat = (_idAux) => {
        const chat = data.find((item) => item._id === _idAux);
        return chat.activeChatStyle === 1
            ? "flex justify-between gap-x-6 p-2 bg-[#4784DE] w-full rounded-xl"
            : "flex justify-between w-full gap-x-6 p-2 rounded-xl";
    };

    const formatTime = (time) => {
        const date = new Date(time);
        const options = {hour: "numeric", minute: "2-digit", hour12: true};
        let formattedTime = date.toLocaleTimeString([], options);

        // Eliminar puntos del tiempo formateado
        formattedTime = formattedTime.replace(/\./g, "");

        // Convertir "AM" o "PM" a mayúsculas y eliminar espacios
        formattedTime = formattedTime.toUpperCase().replace(/\s/g, "");

        // Agregar un espacio entre la hora y las letras
        formattedTime = formattedTime.replace(/(\d+)([A-Z]+)/, "$1 $2");

        return formattedTime;
    };

    const GetImage = (person) => {
        const user = person.users.find((user) => user._id !== idUser);
        return user ? user.image : null;
    };

    const GetName = (person) => {
        const user = person.users.find((user) => user._id !== idUser);
        return user ? user.name : null;
    };

    const GetFinalMessage = (_id) => {
        const user = data.find((user) => user._id === _id);
        if (user && user.messages.length > 0) {
            const indexMessage = user.messages.length - 1;
            return user.messages[indexMessage].body;
        }
        return null;
    };

    return (
        <div className=" grid h-screen p-2 bg-[#C8CDD0] grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-1 h-full p-4 m-1 rounded-xl bg-[#aaaa]">
                <HeaderChat/>
                {data && data.length > 0 ? (
                    <ul className="mt-1 w-full">
                        {data.map((person) => (
                            <li
                                key={person._id}
                                className={setStyleChat(person._id)}
                                onClick={() => openConversation(person._id)}
                            >
                                <div className="flex gap-x-4 w-4/5">
                                    <img
                                        className="h-11 w-11 flex-none rounded-full"
                                        src={GetImage(person)}
                                        alt=""
                                    />
                                    <div className="min-w-0 flex-auto w-full">
                                        <p className="text-sm font-bold leading-6 text-black ">
                                            {GetName(person)}
                                        </p>
                                        <p className="w-full truncate text-sm leading-5 Roboto text-black">
                                            {GetFinalMessage(person._id)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end truncate relative">
                                    <p className="text-xs text-black">
                                        <time dateTime={person.lastMessageAt}>
                                            {formatTime(person.lastMessageAt)}
                                        </time>
                                    </p>
                                    <div
                                        className="absolute bottom-0 left-0 transform translate-x-[60%] translate-y-[-0%] bg-[#DF6675] rounded-full w-5 h-5">
                                        <p className="text-white font-bold p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            1
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <h2 className="text-black text-center pt-2">No cuentas con ningun chat disponible</h2>
                )}
            </div>
            <div className="lg:col-span-2 min-h-full pt-2 px-2 m-1 rounded-xl bg-[#F1F1F1]">
                {dataMessages ? (
                    <Chat
                        dataMessages={dataMessages}
                        setDataMessages={setDataMessages}
                        socket={socket}
                        idConversation={idConversation}
                        UserChat={UserChat}
                        formatTime={formatTime}
                        data={data}
                    />
                ) : (
                    /* Sin chat abierto*/
                    <UnsetChat/>
                )}
            </div>
        </div>
    );
};

export default Home;
