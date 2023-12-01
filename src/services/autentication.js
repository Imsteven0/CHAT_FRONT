import axios from "axios";

const BASEURL = 'http://localhost:8000';

/* END-POINT que permite al usuario loguearse en el sistema. */
export const loginFetch = async (values) => {
    try {
        return await axios.post(BASEURL + '/Auth/login', values, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.error('Error en la solicitud:', e.message);
        console.error(e);
    }
}

/* END-POINT que permite al usuario registrarse en el sistema. */
export const registerFetch = async (values) => {
    return await fetch(BASEURL + '/Auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    });
}