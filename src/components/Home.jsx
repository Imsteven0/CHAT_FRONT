import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import io from "socket.io-client";

const Home = () => {
  let idUser = localStorage.getItem("idUser");
  const [data, setData] = useState(null);
  const [dataMessages, setDataMessages] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io("http://localhost:8000", {
      path: "/socket.io",
    });
    setSocket(socket);

    // You can listen for events and perform actions
    socket.on("connection", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("messageReceived", async (message) => {
      fetchNewMessage(message);
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [data, dataMessages]);

  const fetchNewMessage = async (message) => {
    const result = data.find((item) => item._id == message.conversationId);
    if (result) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/Message/listMessagesById/" + message._id
        ); // Cambia la URL a la API que desees utilizar
        const jsonData = await response.json();
        console.log(jsonData[0]);
        setDataMessages((prevDataMessages) => [
          ...prevDataMessages,
          jsonData[0],
        ]);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    } else {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/Conversation/listConversationById/" + idUser
        ); // Change the URL to the API you want to use
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error("Error making the request:", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (IdConversation) => {
    const user = data.filter((user) => user._id === IdConversation);
    user[0].messages.IdConversation = IdConversation;
    setDataMessages(user[0].messages);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  const userPicture = (id) => {
    let image = null;
    data.forEach((item) => {
      const user = item.users.filter((user) => user._id === id);
      if (user.length > 0) {
        image = user[0].image;
      }
    });
    return image;
  };
  
  const setColorChat = (id) => {
    return id === idUser
      ? "flex justify-between gap-x-6 p-2 mb-2 rounded-md bg-gray-500"
      : "flex justify-between gap-x-6 p-2 mb-2 rounded-md bg-green-700";
  };

  const GetImage = (person) => {
    const user = person.users.filter((user) => user._id !== idUser);
    return user.length > 0 ? user[0].image : null;
  };

  const GetName = (person) => {
    const user = person.users.filter((user) => user._id !== idUser);
    return user.length > 0 ? user[0].name : null;
  };

  const GetFinalMessage = (_id) => {
    const user = data.filter((user) => user._id === _id);
    let indexMessage = user[0].messages.length
    return user[0].messages.length > 0 ? user[0].messages[indexMessage - 1].body : null;
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-700">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-1 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                {data ? (
                  <ul className="divide-y divide-gray-100">
                    {data.map((person) => (
                      <li
                        key={person._id}
                        className="flex justify-between gap-x-6 py-2"
                        onClick={() => handleClick(person._id)}
                      >
                        <div className="flex gap-x-4">
                          <img
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={GetImage(person)}
                            alt=""
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-white">
                              {GetName(person)}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-white">
                              {GetFinalMessage(person._id)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:flex sm:flex-col sm:items-end">
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 text-gray-500">
                              Online
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Loading data...</p>
                )}
              </div>
            </div>
            <div>
              {dataMessages ? (
                <Chat
                  dataMessages={dataMessages}
                  formatTime={formatTime}
                  userPicture={userPicture}
                  setColorChat={setColorChat}
                  idUser={idUser}
                  setDataMessages={setDataMessages}
                  socket={socket}
                />
              ) : (
                <p>Loading data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
