import React, {useState, useEffect, useRef} from "react";

const Chat = ({
                  dataMessages,
                  idUser,
                  socket,
                  idConversation,
                  UserChat,
                  formatTime,
                  data
              }) => {
    const [message, setMessage] = useState("");

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        // Al actualizar los mensajes, hacer scroll hacia abajo
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [dataMessages]);

    const SendMessage = (person) => {
        const fetchDataMessages = async () => {
            if (message !== '') {
                let jsonNewMessage = {
                    message: message,
                    IdConversation: idConversation,
                    UserIdSender: idUser,
                };
                //console.log(jsonNewMessage);
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
                            conversationId: idConversation,
                            _id: jsonData._id,
                        });
                    }
                } catch (error) {
                    console.error("Error making the request:", error);
                }
            }
            ;
        }
        fetchDataMessages();
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
                            <p className="flex text-xs font-semibold text-white">
                                {userName(message.senderId)}
                            </p>
                            <p className="flex text-xs font-semibold text-white">
                                <time dateTime={message.createdAt}>
                                    {formatTime(message.createdAt)}
                                </time>
                            </p>
                        </div>
                        <div className="min-w-0 flex justify-end max-w-lg p-1 rounded-lg bg-[#6B8AFD]">
                            <p className="text-sm px-2 font-semibold leading-6 text-white">
                                {message.body}
                            </p>
                        </div>
                    </div>
                </li>
            )
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
                                <p className="flex text-xs font-semibold text-white">
                                    {userName(message.senderId)}
                                </p>
                            </div>
                            <p className="flex text-xs font-semibold text-white">
                                <time dateTime={message.createdAt}>
                                    {formatTime(message.createdAt)}
                                </time>
                            </p>
                        </div>
                        <div className="min-w-0 flex-auto max-w-lg p-1 rounded-lg bg-[#2E343D]">
                            <p className="text-sm px-2 font-semibold leading-6 text-white">
                                {message.body}
                            </p>
                        </div>
                    </div>
                </li>
            )
        }
    };

    return (
        <div className="flex flex-col rounded-md">
            <ul>
                {UserChat ? (
                    UserChat.map((user) => (
                        <li key={user._id} className="flex justify-between gap-x-4 p-2 mb-2 rounded-md bg-[#2E343D]">
                            <div className="flex gap-x-4">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.image}
                                    alt=""
                                />
                                <div className="flex flex-col gap-x-4">
                                    <p className="flex text-base font-bold text-white">
                                        {user.name}
                                    </p>
                                    <p className="flex text-xs font-semibold text-white">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-2">
                                <img
                                    className="h-7 w-7"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEb0lEQVR4nO2aa4hVVRTHf6ONFZOPEXyVLySolDFotPoypU1i4oOUMlLILEPD0tIvBtGLPvhIIUQRqSRCRUWSRPABKkpk+cXG1EoN8tFjqtHyXY4TG9aBxeLce2fu3L3PmfH84MDcO+ee/9r7rL322mtvyMjIyMjIyMjIyPBJR6AvcC/wADAIqKQdcwfwDLAaqAOuAk0x1x/AHuBt4CHaAUOANcDFHA0udH0PvA5U0Ma4E1gPNOZpnOuUU8BJ4Hfgvzz31gMvAx1oAzwP/B3TCNfQxcAYoHfM78qBwcCLwEbgSswzvpJ4kUrKgY9jjN4JPAaUtfB5XYF5wC/meeekE1PF7cC2mDf+RAmeXSGeo4fIv8BUUsItwFbTeOfCXUqsUwOcVRrXgYmkgBWm8UuKcPfm0h84prRcnKgmQZ4yjV8aQLMP8JPSPOHB25pFd5meIkO2NPPN3y+JjguO3wFHgEdoGfcBF5T2chJ2/dPSIfkYDuzPMc+vLEJ/uokHQwnIXSadfTrPvc4r3o1Jiv6UDllf5NxeJmmzDrzBWKiEDxQw8lN17w1gHfBwiQLlMPXsxlBJUkfgjBKelOfe98xCp9aDPbuUxlsEoMbk6C4DzDXmr6vG3+PJnmeVPYcJwDtK0C1vc7Fb3Tfaoz0uU7ymhlgvPLNDNWxKnmWwnh59o2cX79nhz0rMzce53P+GDAEX8HzzobJpge8A2KiibqcCsSJUVecV1QGrfAp1VULnSQ9TlF1umvVGLyX0G+nhSWXX576Lm01y/ZPnPjc05gOTCcNUZddan0IdpBgRxYDbCuTpLhAOxD9zQy6MflBiVTnueVQ6qCFQvX+lsuk132JblJh707m4G+hJGL5RNj3uW2yeEvuM5KlUKberG3b2LTjUTIWuIJokM5Q9e0OJHlGi00iWA8qW2aFE5yvRownu2NSaablbKOEuEuEj8VkkU44/pGxYFtqAN5R4g5SsQ7JA6butuB6B9ekku7eREV8CtwbSrjE7RXNIiAdVMcJdG2TF6BO3BP9Lae5Jetf4VVPt3eTRE6plKz3SOqt2mmvlxEkifGA64WsPa4DngEtGp1621JfL52uyMgxOmezgNpnANEeidWsYYNLvqKHR35di/jeBhJhtjIu2yWdJMaUlVEl1xz7vkNT/V5nvbSeMIyGGyZ6fNeoy8IUsXUfIMZoK8Z5KGb8TxZO+jfl9o8z1Ueodub0uvtapz1eTPEhRLtmi3jxtzbXbbIO/YP6/WTR7ms6/4rkkX5AKGRYHi2j0RanuxFWV3zf3TjZlO3uGYBQpYBDwEvCJLGB+VcfnGmSffzuwCBhbYJXZ3bi7DXx9TJJ22dO2XKL0iOmE8cYTjppOcIe12l0nHM4T/fuKZ+kpcyTtjN4Fxnx/c6TmQqBCbVDixrx29zdN0EzdOcNS4PKKH427u3xjppTno++3lyA7TS1uzB83nqAbvzMFNUzv2MAXXfva4qnzYukna5Co8ftlW++mYoCsDz66md58Rgat4393ZP+wldK/RQAAAABJRU5ErkJggg=="
                                    alt=""
                                />
                                <img
                                    className="h-7 w-7"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwklEQVR4nO2WMQrCQBBFn+kslKA3sLCzEUTsPEO8QNwT2YlgwPMIwRPkCOIJRBEiLoN2S2aEefCrWdjPsjPzwXH+gBEw0zZQA1dgLmoDYJJYfWkgB87Ao9UNWET1Mqql0lqaKIC7OLTr2sSLEBmpgIwPK+CQWFN+EICjMOCokQFDveuhB+yBCzDWeoEqap+6HV5vNkCTWEtpovzSx6eu50Rm4SVM/Akz3eHEbLV3R9DeooWFPJFbSFYmMqaZtO04ZngCWM7VpnLKaxAAAAAASUVORK5CYII="
                                    alt=""
                                />
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Loading data...</p>
                )}
                <div className="h-[36.5rem] overflow-y-auto scroll-smooth" ref={messagesContainerRef}>
                    {dataMessages.map((message) => (
                        <div key={message._id}>
                            {chatUserMessages(message.senderId, message)}
                        </div>
                    ))}
                </div>
            </ul>
            <div className="relative flex rounded-md">
                <input
                    id="body_message"
                    name="body_message"
                    type="text"
                    required
                    className="min-w-0 flex-auto bg-[#202329] px-3.5 py-2 m-2.5 text-white ring-inset sm:text-sm sm:leading-6 resize"
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
