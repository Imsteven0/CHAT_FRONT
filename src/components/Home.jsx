import React, { useEffect } from 'react';
import Typed from 'typed.js';
import Navbar from "./Navbar";

const Home = () => {

  useEffect(() => {
    const multiText = new Typed(".multiText", {
      strings: [
        "Steven Araya"
      ],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
      backDelay: 150,
    });

    return () => {
      multiText.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="overflow-hidden bg-white py-20 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-orange-400 sm:text-4xl">
                  Hola! Soy&nbsp;
                  <span class="multiText"></span>
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Web Developer junior
                </p>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Soy un pasionado desarrollador web junior con 1 año de
                  experiencia en el desarrollo de aplicaciones web. Mi
                  entusiasmo por la tecnología y el diseño me ha llevado a
                  sumergirme en el mundo del desarrollo web, donde he adquirido
                  habilidades sólidas en lenguajes como HTML, CSS y JavaScript.
                </p>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Además, también he desarrollado experiencia en el ámbito del
                  backend. Durante mi año de experiencia como desarrollador web
                  junior, he trabajado en proyectos donde he adquirido
                  habilidades en el desarrollo de servidores y la gestión de
                  bases de datos. He utilizado tecnologías como Node.js y PHP
                  para crear y mantener el lado del servidor de las aplicaciones
                  web. Además, he trabajado con frameworks como Express.js y
                  Laravel para agilizar el proceso de desarrollo.
                </p>
              </div>
            </div>
            <div>
              <img
                src={process.env.PUBLIC_URL + "/PoloSkins.webp"}
                alt="Dentist"
                className="w-[30rem] max-w-none rounded-xl  sm:w-[42rem] md:-ml-4 lg:-ml-0"
                width={1024}
                height={1024}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;
