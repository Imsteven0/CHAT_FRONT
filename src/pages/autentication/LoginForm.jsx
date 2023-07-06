import React, {useState} from "react";
import {useAuth} from '../../hooks/useAuth'
import {Navigate} from "react-router-dom";
import {loginFetch} from '../../services/autentication'

export default function LoginForm() {
    const {user, login} = useAuth()

    const [email, setEmail] = useState('');
    const [password, SetPassword] = useState('');

    if (user) return <Navigate to="/"/>

    const sendToLogin = async () => {
        if (email !== '' && password !== '') {
            const dataAuth = {email: email, hashedPassword: password}
            let response = await loginFetch(dataAuth)
            if (response.status === 200) {
                const jsonData = await response.json();
                login(jsonData.token)
            }
        }
    }


    return (
        <>
            <div>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Iniciar sesión en su cuenta
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
                            <div className="space-y-6">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Correo eletronico
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Contraseña
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => SetPassword(e.target.value)}
                                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={() => sendToLogin()}
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            No estas resgistrado?{' '}
                            <a className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Registrate ahora!
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
