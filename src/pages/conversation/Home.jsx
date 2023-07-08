import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Chat from "./Chat";
import io from "socket.io-client";
import {useAuth} from '../../hooks/useAuth'
import {compareDates} from '../../helpers/compareDates'

import {getConversationByIdUser, getSpecificMessage} from '../../services/conversation'
import UnsetChat from "../unset/UnsetChat";

const Home = () => {
    const navigate = useNavigate();
    const {user, idUser, expiresIn/*, token*/, logout} = useAuth()

    useEffect(() => {
        if (!compareDates(expiresIn)) {
            logout();
        }
        if (!user) {
            navigate("/login");
        }
    }, [expiresIn, logout, user, navigate]);

    const [data, setData] = useState([]);
    const [dataMessages, setDataMessages] = useState(null);
    const [idConversation, setIdConversation] = useState(null);
    const [socket, setSocket] = useState(null);
    const [UserChat, setUserChat] = useState([]);

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

    const UserRegisterData = (data) => {
        if (data.length > 0) {
            const user = data[0].users.find((user) => user._id === idUser);

            // Obtener la hora actual
            let horaActual = new Date().getHours();

            // Inicializar la variable de saludo
            let saludo;

            // Generar el saludo según la hora actual
            if (horaActual >= 5 && horaActual < 12) {
                saludo = 'Good Morning!';
            } else if (horaActual >= 12 && horaActual < 18) {
                saludo = 'Good Afternoon!';
            } else if (horaActual >= 18 && horaActual < 21) {
                saludo = 'Good Evening!';
            } else {
                saludo = 'Good Night!';
            }

            return (
                <div className="relative flex rounded-md mt-auto items-center pl-2 pb-2 border-b-2">
                    <img
                        className="h-11 w-11 rounded-3xl"
                        src={user.image}
                        alt=""
                    />
                    <div
                        className="absolute bottom-0 left-0 transform translate-x-[350%] translate-y-[-70%] bg-[#47DC44] rounded-full w-3 h-3"></div>
                    <div className="flex flex-col">
                        <div>
                            <p className="pl-4 text-[#A1A4AF] font-SansCaption text-xs">{saludo}</p>
                        </div>
                        <p className="pl-4 text-black font-SansCaption text-sm">{user.name}</p>
                    </div>
                    <div className="flex ml-auto gap-2.5">
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]">
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAc0lEQVR4nO2UMQqAMAxF3/Gsg3j/wULVQS8Rl05FpGATpeTBX/MgCR+cnzMDJ3AAk6V4ByRnsxRLERerIb5qK6SbVY9AvBn8NhEIT+KkIK1quPSVOACLgnQBBhrQz1fX4mIzxG9sRSzKwYwArDlNGslBiwtYs6fhOILl9QAAAABJRU5ErkJggg=="
                                alt=""
                            />
                        </button>
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]">
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+klEQVR4nO2aT0sVURiHH+uakRt3GWmgSEqFCCm0EcR1BH6NXKub1Dbhun1kou70C0Q7DQKtlWvBCLmBrVXQRg6cAzL4Z6Zm5n3P+D7wwGyGe36/O3PuPXMGDMMwDMMwjMq5A/R73fGN4RGwCBwDidcdfwS6qTnDwO9zwdM2gefUlE7g5xXhg3vAfWrEC2AFOMwQPngErPsrJloeAKvA3xzB07pzl4EOIvzW9/8j+EW3xVMiYTTn5Z7VPzFMkL3AQQnhg7/8ZKqSFuBLieGDn1HKRAXhg69QyEaFBWyjjJ4KwwefoIhJgQKmUMQngQLcgkoN3wQKcJ+phn2BAtzCSgUN4ESgALdgUsFjgfDB7pv2ByhJ+RIFzAkWMIsCvgoWsCkdvg84FSzg1D9VFmNFMHxwTeqnb15B+OCCH1MlDAA/FIRO+72K26Ed2FUQ9jLd2O6VWcC0gpBiq8RGxo0NaffKmg/GFYTL6lgZBSwoCJbVd2UUsK0gWFa3ig5/yy8/k0h0Y71d9J5+EpldRRYwqCBQXp8VWcCQgkB5dWMujLuRzQFuc7aNgplVECyrbyhp83MS2BF6CHqdJ35sr/1YDcPQw0NgJqfunFrxIceEtkQNaQBvr3mK7F6Lew+0UmNG/HZ681zwpt/ujvrFyH99xug0DMMwDMOgas4Aa7vGSWpr9C0AAAAASUVORK5CYII="
                                alt=""
                            />
                        </button>
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]">
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO2ZzWtTURDFf25ixSiIiO22FdutG8FFa2PpX+CytRQLotD/waILrXv3piCIyySk7VYXfrRd+rVx407blaI2FSNXbyAMk7SJM3kv+g4MhMA95x3umzsz90GGDKnEELAArABbwDZQi/EJ2ASKwFVgkBRiEqgAP4D6AWMPKAMTpABngLUOHr5VVIGRpEzMAV8MTDTiMzDbaxO32jzQa+AOMAWMAkdjjMX/7gJv2qxf6pWJ2y0e4AVQ6IDnAvA0KTNziugucA041AVfWHM9ckjeGRwTW+ZEOF7HDbjDybWj5MwwDpCn066RiQYuxnrTrFHBoU7IrQ+vkzVuKDrjlgIVQf68y5zYD4HzpdAqWbYde4I8vAZeKCgdwGkL4gVB/Ap/vBWa8xakK4I0FDtvLAvNBxakW4I0VGdvTAvNDQvSbUF6Fn+MCs2PFqSy6ubxR15ofvcwcgx/HFeq/D/xar23IN1MQbI/syAtCtIwT3jjntC871EQw1DkjXdC87IF6aDSooQm0gtTSpd90oq8rEyDXk2jzMmipcCE0l6Hyc4ai4rOOWuRqhCoGd9JFZTB6iEOGImFqVlox6iln1RG3XAzeQonzCpbX4uTXbeXD4vKToR4AuRwxJIi2uhQL3V4OsnEllEFBpIwU49D0XKszmOxAczH39Ox2Mk60S5K3jszo+SMV5SBw55mhpWLiU7jJ/AYWE/aDPHKpqR0AO3iG/AIOP+b4U8urO6zptILM8Tbjvk4Y2/EIzS0GF+BD/GqJzSAV4ATyvpUmflb5JSWqC5i1fs066WZtcxMAsj9bzuzDhyhDzBwgNOs598fPXbmJn2GnGKm70xoZvrWRHPOuH0szZCB1vgFpd/exdTtQfAAAAAASUVORK5CYII="
                                alt=""
                            />
                        </button>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                </>
            )
        }
    }

    return (
        <div className="h-screen w-screen py-4 bg-[#C8CDD0] flex flex-col">
            <div className="mx-16 grid grid-cols-1 h-full gap-x-4 gap-y-16 lg:grid-cols-3">
                <div className="lg:col-span-1 p-4 m-1 h-full rounded-xl bg-[#ffff] flex-1 overflow-auto">
                    {data ? (
                        <>
                            {UserRegisterData(data)}
                        </>
                    ) : (
                        <>
                        </>
                    )}
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
                <div className="lg:col-span-2 h-full p-4 m-1 rounded-xl bg-[#F1F1F1] flex-1 overflow-auto">
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
        </div>
    );
};

export default Home;