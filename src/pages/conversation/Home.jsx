import React, {useEffect, useState} from "react";
import Chat from "./Chat";
import io from "socket.io-client";

import {getConversationByIdUser, getSpecificMessage} from '../../services/conversation'
import UnsetChat from "../unset/UnsetChat";
import ModalCustom from "../modales/ModalCustom";
import {useAuth} from "../../hooks/useAuth";
import {compareDates} from "../../helpers/compareDates";
import HeaderChat from "./headers/HeaderChat";

const Home = () => {
    const {idUser, expiresIn, logout} = useAuth()
    const [data, setData] = useState([]);
    const [dataMessages, setDataMessages] = useState(null);
    const [idConversation, setIdConversation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [UserChat, setUserChat] = useState([]);

    if (!compareDates(expiresIn)) {
        logout();
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getConversationByIdUser(idUser);
                if (response.status === 200) {
                    const jsonData = await response.json();
                    console.log(jsonData)
                    setData(jsonData);
                } else {
                    throw new Error("Error fetching data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        handleDataChange(data, idConversation);
    }, [data, idConversation]);

    const handleDataChange = (newData, idConversation) => {
        const conversation = newData.find((item) => item._id === idConversation);
        if (conversation) {
            setDataMessages(conversation.messages);
        }
    };

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = io("http://localhost:8000", {
            path: "/socket.io",
        });
        setSocket(socket);

        // You can listen for events and perform actions
        socket.on("connection", () => {
            //console.log("Connected to Socket.IO server");
        });

        socket.on("messageReceived", async (message) => {
            fetchNewMessage(message);
        });

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [data, dataMessages, idConversation]);

    const fetchNewMessage = async (message) => {
        const result = data.find((item) => item._id === message.conversationId);
        if (result) {
            try {
                let response = await getSpecificMessage(message._id);
                if (response.status === 200) {
                    const jsonData = await response.json();
                    const newData = data.map((item) => {
                        if (item._id === message.conversationId) {
                            return {
                                ...item,
                                messages: [...item.messages, jsonData[0]],
                            };
                        }
                        return item;
                    });
                    setData(newData);
                } else {
                    throw new Error("Error fetching new message");
                }
            } catch (error) {
                console.error("Error fetching new message:", error);
            }
        }
    };

    const openConversation = (IdConversation) => {
        // Se activan los estilos para el chat activo.
        setActiveChatStyle(IdConversation);
        // Se setea id el de la conversacio global.
        setIdConversation(IdConversation);

        const conversation = data.find((item) => item._id === IdConversation);
        const userConversation = conversation.users.find((item) => item._id !== idUser)
        if (conversation) {
            setDataMessages(conversation.messages);
        }
        if (userConversation) {
            setUserChat([userConversation])
        }
    };

    /* Su funcion se basa en poner un estado activo a una conversacion*/
    const setActiveChatStyle = (IdConversation) => {
        data.forEach((obj, index) => {
            obj.activeChatStyle = obj._id === IdConversation ? 1 : 0;
        })
    }

    const setStyleChat = (_idAux) => {
        const chat = data.find((item) => item._id === _idAux);
        return chat.activeChatStyle === 1 ? 'flex justify-between gap-x-6 p-2 bg-[#4784DE] w-full rounded-xl' : 'flex justify-between w-full gap-x-6 p-2 rounded-xl';
    }

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
                <HeaderChat data={data}/>
                {data ? (
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
                                        <p className="text-white font-bold p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">1</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <div className="lg:col-span-2 min-h-full pt-2 px-2 m-1 rounded-xl bg-[#F1F1F1]">
                {dataMessages ? (
                    <Chat
                        dataMessages={dataMessages}
                        idUser={idUser}
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