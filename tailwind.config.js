/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-chat-app': '#202329'
            }
        },
        fontFamily: {
            SansCaption: ["PT Sans Caption", "sans-serif"],
            /*BreeSerif: ["Bree Serif", "serif"]*/
            Roboto: ["Roboto", "sans-serif"],
        }
    },
    plugins: [],
}

