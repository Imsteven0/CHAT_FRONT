import React, { useState } from "react";

const Chat = ({
  dataMessages,
  formatTime,
  userPicture,
  setColorChat,
  idUser,
  setDataMessages,
  socket,
  fetchNewMessage
}) => {
  const [message, setMessage] = useState("");

  const trya = (person) => {
    console.log(person);
  };

  const SendMessage = (person) => {
    console.log(person.IdConversation);
    const fetchDataMessages = async () => {
      let jsonNewMessage = {
        message: message,
        IdConversation: dataMessages.IdConversation,
        UserIdSender: idUser,
      };
      console.log(jsonNewMessage);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/Message/newMessage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonNewMessage),
          }
        );
        const jsonData = await response.json();
        if (response.status === 200) {
          setMessage("");
          socket.emit("newMessage", {
            conversationId: jsonData.conversationId,
            _id: jsonData._id,
          });
        }
      } catch (error) {
        console.error("Error making the request:", error);
      }
    };

    fetchDataMessages();
  };

  return (
    <div className="flex flex-col bg-zinc-700 p-3 rounded-md h-screen">
      <div className="overflow-y-auto">
        <ul role="list" className="divide-y divide-gray-100">
          {dataMessages.map((message) => (
            <li key={message.body} className={setColorChat(message.senderId)}>
              <div className="flex gap-x-4">
                <img
                  className="h-10 w-10 flex-none rounded-full bg-gray-50"
                  src={userPicture(message.senderId)}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-white">
                    {message.body}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-white">
                  Recibido{" "}
                  <time dateTime={message.createdAt}>
                    {formatTime(message.createdAt)}
                  </time>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-x-4 bg-slate-600 p-3 rounded-md mt-auto">
        <label htmlFor="body_message" className="sr-only">
          Email address
        </label>
        <input
          id="body_message"
          name="body_message"
          type="text"
          autoComplete="email"
          required
          className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Escribe un mensaje aquí"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => SendMessage(dataMessages)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
