import React, { useState, useEffect, useRef } from "react";

import { newMessage } from "../../services/conversation";

const Chat = ({
  dataMessages,
  idUser,
  socket,
  idConversation,
  UserChat,
  formatTime,
  data,
}) => {
  const [message, setMessage] = useState("");

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Al actualizar los mensajes, hacer scroll hacia abajo
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [dataMessages]);

  const SendMessage = (person) => {
    if (message !== "") {
      let jsonNewMessage = {
        message: message,
        IdConversation: idConversation,
        UserIdSender: idUser,
      };
      socket.emit("newMessage", jsonNewMessage);
      setMessage("");
    }
  };

  const userName = (id) => {
    let name = null;
    data.forEach((item) => {
      const user = item.users.find((user) => user._id === id);
      if (user) {
        name = user.name;
      }
    });
    return name;
  };

  const userPicture = (id) => {
    let image = null;
    data.forEach((item) => {
      const user = item.users.find((user) => user._id === id);
      if (user) {
        image = user.image;
      }
    });
    return image;
  };

  const chatUserMessages = (id, message) => {
    if (id === idUser) {
      return (
        <li className="flex justify-end gap-x-4 p-2 mb-2 rounded-md">
          <div className="flex flex-col gap-x-4">
            <div className="flex gap-x-4 justify-between p-1">
              <p className="flex text-xs font-semibold text-black">
                <time dateTime={message.createdAt}>
                  {formatTime(message.createdAt)}
                </time>
              </p>
              <div className="flex gap-3">
                <p className="flex text-xs font-semibold text-black">
                  {userName(message.senderId)}
                </p>
                <img
                  className="h-6 w-6 rounded-full"
                  src={userPicture(message.senderId)}
                  alt=""
                />
              </div>
            </div>
            <div className="min-w-0 flex justify-end max-w-lg p-1 rounded-lg bg-[#4784DE]">
              <p className="text-xs px-2 font-semibold leading-6 text-black">
                {message.body}
              </p>
            </div>
          </div>
        </li>
      );
    } else {
      return (
        <li className="flex justify-start gap-x-4 p-2 mb-2 rounded-md">
          <div className="flex flex-col gap-x-4">
            <div className="flex gap-x-4 justify-between p-1">
              <div className="flex gap-3">
                <img
                  className="h-6 w-6 rounded-full"
                  src={userPicture(message.senderId)}
                  alt=""
                />
                <p className="flex text-xs font-semibold text-black">
                  {userName(message.senderId)}
                </p>
              </div>
              <p className="flex text-xs font-semibold text-black">
                <time dateTime={message.createdAt}>
                  {formatTime(message.createdAt)}
                </time>
              </p>
            </div>
            <div className="min-w-0 flex-auto max-w-lg p-1 rounded-lg bg-[#ffff]">
              <p className="text-xs px-2 font-semibold leading-6 text-black">
                {message.body}
              </p>
            </div>
          </div>
        </li>
      );
    }
  };

  return (
    <div className="flex h-full flex-col rounded-md">
      <div className="">
        <ul>
          {UserChat ? (
            UserChat.map((user) => (
              <li
                key={user._id}
                className="flex justify-between gap-x-4 p-2 mb-2 rounded-md bg-[#ffff]"
              >
                <div className="flex gap-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.image}
                    alt=""
                  />
                  <div className="flex flex-col gap-x-4">
                    <p className="flex text-base font-bold text-black">
                      {user.name}
                    </p>
                    <p className="flex text-xs font-semibold text-black">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex ml-auto gap-2.5">
                  <button className="rounded-full p-3 bg-[#F5F5F5] hover:bg-[#4784DE]">
                    <img
                      className="h-4 w-4"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO2ZzWtTURDFf25ixSiIiO22FdutG8FFa2PpX+CytRQLotD/waILrXv3piCIyySk7VYXfrRd+rVx407blaI2FSNXbyAMk7SJM3kv+g4MhMA95x3umzsz90GGDKnEELAArABbwDZQi/EJ2ASKwFVgkBRiEqgAP4D6AWMPKAMTpABngLUOHr5VVIGRpEzMAV8MTDTiMzDbaxO32jzQa+AOMAWMAkdjjMX/7gJv2qxf6pWJ2y0e4AVQ6IDnAvA0KTNziugucA041AVfWHM9ckjeGRwTW+ZEOF7HDbjDybWj5MwwDpCn066RiQYuxnrTrFHBoU7IrQ+vkzVuKDrjlgIVQf68y5zYD4HzpdAqWbYde4I8vAZeKCgdwGkL4gVB/Ap/vBWa8xakK4I0FDtvLAvNBxakW4I0VGdvTAvNDQvSbUF6Fn+MCs2PFqSy6ubxR15ofvcwcgx/HFeq/D/xar23IN1MQbI/syAtCtIwT3jjntC871EQw1DkjXdC87IF6aDSooQm0gtTSpd90oq8rEyDXk2jzMmipcCE0l6Hyc4ai4rOOWuRqhCoGd9JFZTB6iEOGImFqVlox6iln1RG3XAzeQonzCpbX4uTXbeXD4vKToR4AuRwxJIi2uhQL3V4OsnEllEFBpIwU49D0XKszmOxAczH39Ox2Mk60S5K3jszo+SMV5SBw55mhpWLiU7jJ/AYWE/aDPHKpqR0AO3iG/AIOP+b4U8urO6zptILM8Tbjvk4Y2/EIzS0GF+BD/GqJzSAV4ATyvpUmflb5JSWqC5i1fs066WZtcxMAsj9bzuzDhyhDzBwgNOs598fPXbmJn2GnGKm70xoZvrWRHPOuH0szZCB1vgFpd/exdTtQfAAAAAASUVORK5CYII="
                      alt=""
                    />
                  </button>
                  <button className="rounded-full p-3 bg-[#F5F5F5] hover:bg-[#4784DE]">
                    <img
                      className="h-4 w-4"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAiElEQVR4nO2WQQqAMBADh75A/ZR9lUg/XW8VYYUi0pNbUBPIqYeELA2BF2MConHsKRyABGxAMWZgtTd3pEr4ysOEe+xbw0D2PkdsiJ+cP21gtJhbJxhwxtowsNABwUzUSWQT7/IN63NEu7l77HdQExY1IWpC1ISoCaM2IdqEaBOiTVh+uwl5Ajscaq8SiXQEyQAAAABJRU5ErkJggg=="
                      alt=""
                    />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>Loading data...</p>
          )}
        </ul>
      </div>
      <div className="overflow-y-auto scroll-smooth" ref={messagesContainerRef}>
        {dataMessages.map((message) => (
          <div key={message._id}>
            {chatUserMessages(message.senderId, message)}
          </div>
        ))}
      </div>
      <div className="flex relative mt-auto">
        <input
          id="body_message"
          name="body_message"
          type="text"
          required
          className="min-w-0 flex-auto bg-[#ffff] rounded-full px-3.5 py-2 m-2.5 text-black ring-inset sm:text-sm sm:leading-6 resize"
          placeholder="Escribe un mensaje aquí"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="absolute inset-y-0 right-0 flex-none rounded-full px-3.5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => SendMessage(dataMessages)}
        >
          <img
            className=""
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7ElEQVR4nGNgGFLA5MAHU5MD79+YHPiQZr//PwvFBprue+9sevDjfxA2OfjxPshghv//mcg20Hj/eweYgQj84bLZgQ+hVDTwIwQf+HDU9OAnO+oZeBCOd5vuf29AlIFqq18Uam99899w93v8hh748Nfk4MdVxns/KOM0TGrOwwSpuY9+S8999B+EZec/+q+47Nl/tTUv/2tvef3fcNe7/6YHMAz+ZXrw40zT/V8k0A2bCDMIH5ad//i/4rKn/9XXvvyP7BOzgx+/mhz4UEU7A6nuZZpECk2SjTF9EvYH8rOeKbULBxNqF1+DEgAAWJa8+M6ejl8AAAAASUVORK5CYII="
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

export default Chat;
