import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-white fixed w-full z-20 top-0 left-0 dark:dark:bg-white">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://github.com/Imsteven0" className="flex items-center">
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-black">
          Chat
          </span>
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-green-600">
          Connect
          </span>
        </a>
        <div className="flex md:order-2">
          <button
            type="button"
            className="text-black bg-white hover:bg-white border-2 border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-white dark:hover:bg-orange-400"
          >
            Cerrar seccion
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
