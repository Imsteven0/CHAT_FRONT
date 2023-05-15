import * as React from "react";
import { executeRequest } from "../js/fetchGeneric";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Form() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  async function login() {
    if (email === "" || password === "") {
      toast.warning("Por favor complete todos los campos!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    let response = await executeRequest("/login", "POST", {
      email: email,
      password: password,
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("idRol", response.data.id);
      window.location.href = "/";
    } else {
      toast.error("Verifique sus credenciales!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <div className="flex w-full h-screen">
      <ToastContainer />
      <div className="w-full flex items-center justify-center">
        <div className="bg-white px-10 py-10 rounded-3xl border-2">
          <h1 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            Bienvenido de nuevo
          </h1>
          <p className=" text-center font-medium text-lg text-gray-500 mt-4">
            Porfavor ingresa tu credenciales
          </p>
          <div className="mt-8">
            <div className="py-2">
              <label className="text-lg font-medium">Correo</label>
              <input
                className=" w-full border-2 border-gray-100 rounded-xl p-4 m-t1 bg-transparent"
                placeholder="Ingresa tu correo"
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="py-2">
              <label className="text-lg font-medium">Contraseña</label>
              <input
                className=" w-full border-2 border-gray-100 rounded-xl p-4 m-t1 bg-transparent"
                placeholder="Ingresa tu contraseña"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-end py-1">
              <a href="/Register">Crea una nueva cuenta</a>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={login}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 bg-violet-500 text-white text-sm font-bold rounded-xl"
              >
                Iniciar Seccion
              </button>
              <button className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out flex py-3 items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="36px"
                  height="36px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Iniciar Seccion con Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
