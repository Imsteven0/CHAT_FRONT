import React, {useEffect, useState} from "react";
import Chat from "./Chat";
import io from "socket.io-client";
import {useAuth} from '../../hooks/useAuth'
import {Navigate} from "react-router-dom";
import {compareDates} from '../../helpers/compareDates'

import {getConversationByIdUser, getSpecificMessage} from '../../services/conversation'

const Home = () => {
    const {user, idUser, expiresIn, token, logout} = useAuth()

    const [data, setData] = useState([]);
    const [dataMessages, setDataMessages] = useState(null);
    const [idConversation, setIdConversation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [UserChat, setUserChat] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getConversationByIdUser(idUser);
                if (response.status === 200) {
                    const jsonData = await response.json();
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
        return chat.activeChatStyle === 1 ? 'flex justify-between gap-x-6 p-2 bg-[#2E343D] rounded-xl' : 'flex justify-between gap-x-6 p-2 rounded-xl';
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

    if (!compareDates(expiresIn)) logout()
    if (!user) return <Navigate to="/login"/>

    return (
        <div className="h-screen w-screen py-4 bg-[#131313] flex flex-col">
            <div className="mx-16 grid grid-cols-1 h-full gap-x-4 gap-y-16 lg:grid-cols-3">
                <div className="lg:col-span-1 p-4 m-1 h-full rounded-xl bg-[#202329] flex-1 overflow-auto">
                    <div className="relative flex rounded-md mt-auto items-center pb-3">
                        <input
                            id="body_message"
                            name="body_message"
                            type="text"
                            required
                            className="min-w-0 flex-auto pl-11 rounded-md border-0 bg-gray-500 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            placeholder="Buscar"
                        />
                        <button
                            className="absolute flex-none px-3 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <img
                                className="h-7 w-7"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACNUlEQVR4nO2YzWoUQRDHfxlwyNlEMB51j+IHJu9gfAejuQhBkaCvIHhKvOlJDwFx4wP4ddBNvOailxziNSroQQ+CutFIQQ0URdBNtmtmR/oHzTLL9r+qe6qqqxcymUymzUwAl4DHwAawDfzQT3leBeb0dyNFR53bAXYHGH2gq/MapQSWgZ8DOu6HzFtSndo5Aqw7h34BL4FF4Bwwpc5N6bN8/0p/Z+etAZN1O//OOfEEODXg/NPAMzd/q65FHNJdtPF8/YBaV1z4va4jnJZdDM8OqTerm1BpSk6EcVzLYmVsIZHuNbcpHYJYdTGfkudGW0pscibMq5YqcjaxvhSAqjrtRCT0ZbNDUiojWDM2LkaGj9TzCG4YG2IvKRtGXA6lCGaMjc3U4u+N+FFiOGZsfE0tbstn1GFTunKalG0jLr1N9Bv4GJkD08TnwJs2VqGbxsbD1OJzRlyauQh6xsZ89EksLXFKpDT/Ngkckmdds0NPE2u/MNorBNFx/fvVRLqL7n5xkkCWnLELQ+qdd/eBWwRTuqarr/38QXfeOv8JGKemO/GWu9NKP39mHwlrY96O+0BBDUy6N1FVp552lTN6spb6Oa11vmeqTTU+N7WIUnPC9kn7GX2N+XF1ereJRQgngEcunv/1h9aKqzbibKOLEA7rTaqr/fwXDasPwFttD+b/ckgVo7CIYRkD7rpFPGjjIu7lRYwAY//Dmyj2SOw7tIzCLeIbLaTQnf8O3G7amUwmk2FP/gDxZx8kD3+mqwAAAABJRU5ErkJggg=="
                                alt=""
                            />
                        </button>
                    </div>
                    {data ? (
                        <ul>
                            {data.map((person) => (
                                <li
                                    key={person._id}
                                    className={setStyleChat(person._id)}
                                    onClick={() => openConversation(person._id)}
                                >
                                    <div className="flex gap-x-4">
                                        <img
                                            className="h-12 w-12 flex-none rounded-full"
                                            src={GetImage(person)}
                                            alt=""
                                        />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-bold leading-6 text-white">
                                                {GetName(person)}
                                            </p>
                                            <p className="mt-1 w-[17rem] truncate text-xs leading-5 text-white">
                                                {GetFinalMessage(person._id)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <p className="mt-4 text-xs leading-5 text-white">
                                            <time dateTime={person.lastMessageAt}>
                                                {formatTime(person.lastMessageAt)}
                                            </time>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading data...</p>
                    )}
                </div>
                <div className="lg:col-span-2 h-full p-4 m-1 rounded-xl bg-[#202329] flex-1 overflow-auto">
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
                        <p className="text-white">Tus mensajes estan cifrados se extremo a extremo</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;