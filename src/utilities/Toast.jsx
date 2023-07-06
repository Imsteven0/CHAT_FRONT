import {toast} from 'react-toastify'

export const notification = (status, msg) => {
    const custom = {
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: false,
        draggable: true,
    }

    if (status === 200) {
        toast.success("Solicitud completada!", custom)
    }

    if (status === 400) {
        toast.warning(msg, custom)
    }

    if (status === 500) {
        toast.error("Error en la solicitud!", custom)
    }
}