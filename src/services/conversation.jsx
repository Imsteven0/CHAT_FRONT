const BASEURL = 'http://localhost:8000';

/* END-POINT que permite guardar un nuevo mensaje. */
export const newMessage = async (values) => {
    return await fetch(BASEURL + '/Message/newMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    });
}

/* Obtener todos los chats/messages/usersData. */
export const getConversationByIdUser = async (idConversation) => {
    return await fetch(BASEURL + '/Conversation/listConversationById/' + idConversation, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/* Obtener un mensaje especifico apartir de un idMessage. */
export const getSpecificMessage = async (idMessage) => {
    return await fetch(BASEURL + '/Message/listMessagesById/' + idMessage, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}