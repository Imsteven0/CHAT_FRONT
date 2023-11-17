import {Fragment, useEffect, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {UserPlusIcon} from '@heroicons/react/24/outline'
import {useSocket} from "../../hooks/SocketContext";
import {useAuth} from "../../hooks/useAuth";

export default function ModalCustom({modalOpen, setModalOpen}) {
    const [email, setEmail] = useState("");
    const [addUser, setAddUsers] = useState([]);
    const socket = useSocket();
    const {idUser} = useAuth();

    useEffect(() => {
        if (!socket) return;

        socket.on("getUsers", async (data) => {
            setAddUsers(data);
        });



        return () => {
            socket.disconnect();
        };
    }, [socket]);


    const searchOnclick = () => {
        if (email === "") return
        socket.emit("searchUser", email);
    }

    return (
        <Transition.Root show={modalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start pb-4">
                                        <div
                                            className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#A4C3FF] sm:mx-0 sm:h-10 sm:w-10">
                                            <UserPlusIcon className="h-6 w-6 text-black"
                                                          aria-hidden="true"/>
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="text-base font-SansCaption leading-6 text-gray-900">
                                                Añadir amigo
                                            </Dialog.Title>
                                            <div className="sm:col-span-3">
                                                <label htmlFor="first-name"
                                                       className="text-sm text-gray-500">
                                                    Puedes añadir amigos por medio de su correo personal
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="first-name"
                                                        id="first-name"
                                                        autoComplete="given-name"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex mx-4">
                                        {addUser && addUser.length > 0 ? (
                                            <table
                                                className="w-full bg-white border border-gray-200 shadow-md mt-4 divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Correo
                                                        electrónico
                                                    </th>
                                                    <th className="py-2 px-4 text-right text-sm font-semibold text-gray-600">Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {addUser.map((person) => (
                                                    <tr key={person._id}>
                                                        <td className="py-2 px-4 text-sm font-SansCaption text-gray-700">{person.name}</td>
                                                        <td className="py-2 px-4 text-sm font-SansCaption text-gray-700">{person.email}</td>
                                                        <td className="py-2 px-4 text-right">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center justify-center rounded-full bg-green-700 text-white px-3 py-1 text-sm font-semibold shadow-md sm:ml-3 sm:w-auto"
                                                                onClick={() => {
                                                                    socket.emit("addFriend", {
                                                                        idUser: person._id,
                                                                        idOriginUser: idUser
                                                                    });
                                                                    setModalOpen(false)
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-gray-500">No hay usuarios para mostrar.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:px-6 justify-between">
                                    <div>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                                            onClick={() => searchOnclick()}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}