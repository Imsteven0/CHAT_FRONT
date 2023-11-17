import React, {useState} from 'react';
import ModalCustom from "../../modales/ModalCustom";
import {useAuth} from "../../../hooks/useAuth";

const HeaderChat = ({data}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const {idUser, logout} = useAuth();

    if (!data || data.length === 0) return null;

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    let user = data[0].users.find((user) => user._id === idUser);
    let saludo;

    // Obtener la hora actual
    let horaActual = new Date().getHours();

    // Generar el saludo según la hora actual
    if (horaActual >= 5 && horaActual < 12) {
        saludo = 'Good Morning!';
    } else if (horaActual >= 12 && horaActual < 18) {
        saludo = 'Good Afternoon!';
    } else if (horaActual >= 18 && horaActual < 21) {
        saludo = 'Good Evening!';
    } else {
        saludo = 'Good Night!';
    }

    return (
        <>
            {user ? (
                <div className="relative flex rounded-md mt-auto items-center pl-2 pb-2 border-b-2">
                    {modalOpen && <ModalCustom modalOpen={modalOpen} setModalOpen={setModalOpen}/>}
                    <img
                        className="h-11 w-11 rounded-3xl"
                        src={user.image}
                        alt=""
                    />
                    <div
                        className="absolute bottom-0 left-0 transform translate-x-[350%] translate-y-[-70%] bg-[#47DC44] rounded-full w-3 h-3"></div>
                    <div className="flex flex-col">
                        <div>
                            <p className="pl-4 text-[#A1A4AF] font-SansCaption text-xs">{saludo}</p>
                        </div>
                        <p className="pl-4 text-black font-SansCaption text-sm">{user.name}</p>
                    </div>
                    <div className="flex ml-auto gap-2.5">
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]"
                                onClick={toggleModal}>
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAc0lEQVR4nO2UMQqAMAxF3/Gsg3j/wULVQS8Rl05FpGATpeTBX/MgCR+cnzMDJ3AAk6V4ByRnsxRLERerIb5qK6SbVY9AvBn8NhEIT+KkIK1quPSVOACLgnQBBhrQz1fX4mIzxG9sRSzKwYwArDlNGslBiwtYs6fhOILl9QAAAABJRU5ErkJggg=="
                                alt=""
                            />
                        </button>
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]">
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+klEQVR4nO2aT0sVURiHH+uakRt3GWmgSEqFCCm0EcR1BH6NXKub1Dbhun1kou70C0Q7DQKtlWvBCLmBrVXQRg6cAzL4Z6Zm5n3P+D7wwGyGe36/O3PuPXMGDMMwDMMwjMq5A/R73fGN4RGwCBwDidcdfwS6qTnDwO9zwdM2gefUlE7g5xXhg3vAfWrEC2AFOMwQPngErPsrJloeAKvA3xzB07pzl4EOIvzW9/8j+EW3xVMiYTTn5Z7VPzFMkL3AQQnhg7/8ZKqSFuBLieGDn1HKRAXhg69QyEaFBWyjjJ4KwwefoIhJgQKmUMQngQLcgkoN3wQKcJ+phn2BAtzCSgUN4ESgALdgUsFjgfDB7pv2ByhJ+RIFzAkWMIsCvgoWsCkdvg84FSzg1D9VFmNFMHxwTeqnb15B+OCCH1MlDAA/FIRO+72K26Ed2FUQ9jLd2O6VWcC0gpBiq8RGxo0NaffKmg/GFYTL6lgZBSwoCJbVd2UUsK0gWFa3ig5/yy8/k0h0Y71d9J5+EpldRRYwqCBQXp8VWcCQgkB5dWMujLuRzQFuc7aNgplVECyrbyhp83MS2BF6CHqdJ35sr/1YDcPQw0NgJqfunFrxIceEtkQNaQBvr3mK7F6Lew+0UmNG/HZ681zwpt/ujvrFyH99xug0DMMwDMOgas4Aa7vGSWpr9C0AAAAASUVORK5CYII="
                                alt=""
                            />
                        </button>
                        {/*<button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]">
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO2ZzWtTURDFf25ixSiIiO22FdutG8FFa2PpX+CytRQLotD/waILrXv3piCIyySk7VYXfrRd+rVx407blaI2FSNXbyAMk7SJM3kv+g4MhMA95x3umzsz90GGDKnEELAArABbwDZQi/EJ2ASKwFVgkBRiEqgAP4D6AWMPKAMTpABngLUOHr5VVIGRpEzMAV8MTDTiMzDbaxO32jzQa+AOMAWMAkdjjMX/7gJv2qxf6pWJ2y0e4AVQ6IDnAvA0KTNziugucA041AVfWHM9ckjeGRwTW+ZEOF7HDbjDybWj5MwwDpCn066RiQYuxnrTrFHBoU7IrQ+vkzVuKDrjlgIVQf68y5zYD4HzpdAqWbYde4I8vAZeKCgdwGkL4gVB/Ap/vBWa8xakK4I0FDtvLAvNBxakW4I0VGdvTAvNDQvSbUF6Fn+MCs2PFqSy6ubxR15ofvcwcgx/HFeq/D/xar23IN1MQbI/syAtCtIwT3jjntC871EQw1DkjXdC87IF6aDSooQm0gtTSpd90oq8rEyDXk2jzMmipcCE0l6Hyc4ai4rOOWuRqhCoGd9JFZTB6iEOGImFqVlox6iln1RG3XAzeQonzCpbX4uTXbeXD4vKToR4AuRwxJIi2uhQL3V4OsnEllEFBpIwU49D0XKszmOxAczH39Ox2Mk60S5K3jszo+SMV5SBw55mhpWLiU7jJ/AYWE/aDPHKpqR0AO3iG/AIOP+b4U8urO6zptILM8Tbjvk4Y2/EIzS0GF+BD/GqJzSAV4ATyvpUmflb5JSWqC5i1fs066WZtcxMAsj9bzuzDhyhDzBwgNOs598fPXbmJn2GnGKm70xoZvrWRHPOuH0szZCB1vgFpd/exdTtQfAAAAAASUVORK5CYII="
                                alt=""
                            />
                        </button>*/}
                        <button className="rounded-full p-2.5 bg-[#F5F5F5] hover:bg-[#4784DE]" onClick={() => logout()}>
                            <img
                                className="h-4 w-4"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAADI0lEQVR4nGNgGAzAzd9f1sDCdo+8ivprcRnZrxIycl/UdQ3uuPkHW1FsuJGV7TYOLq5/rKxs/9V1Df4bWFiDMZ+A4H9hMYmfoaGhbGQb7uwTZsrIyPjf0MLmf+3E2f8nLN8Ex+nl9f8ZGBj+O/kEBZBtgaGVzQ5mFpb/LTMXoxgOwh3zVvwHyRla2uwk2wIRcckf+ubWGIbDsL6Z1X+QGrIMB4UtMzPz/4CYJJwW+EUn/gepISseXHwCbEBhHJ9fhtOCtLK6/6DIz6xp0iTZAjN7pwUgCxqmzMNpAQi3z13+v3/ZhlSSLTC1cVwBSkGts5diGNq/fOPHCcs3TuxfvjFhwoqNoZOWbtIg2QLHgFBjVjb2/zrGZv/7lm5ANvzBhAnzVKMkhJc7CPLetxHgfQyioyVEltTbM7CQZImVs0cPyBfBCelwC/qWbvJ1EeK/zsTI8F+Hh/OTMS/3Wx1uzs+MDAz/g8QF95DsE2VN7ccCwiL/+5dt/N+/bNOfzogkKVZGxv9BYoJ7kdVly4mlFMlJkV50WDq5TgJFdtP0hf8nLNv0oUheyhDET5QSnYCuNldGwqNUSVqVaMP9/eMFDC1td4MMBOdmAhYY8nK9l+Vg+1WsIG6O1UCP6Gg+ULhrGZlekJSV/wIqCkCGgQo5cBygWQCK1HgpkckxkiKLQThQTGgfHwvzP0FWln95MpKBKIY7egUE8QkI/gFpBpWUuiYW/30j4//n1rWDwx+bBcVyksbsTExgR6BjN2H+a3DDfXx8uEBFr7i07P/Sjgm4M9YyzCCql5ERKpaTUwThcHGR9aDU5CTEfwslyTp4+8aDNGVVNePNtRMIxIGdIO9DTxH+ixj5wcrZswOkqW7yHEIWfCqWkdEBl1FSIpOJTi2WLh5dRFmwfNP/nplLRYRZWf6a8XO/ypOX8CpVkLAH0Z7C/BcSpcW6sVpg6+mXAUstsCoRHQfGpUCKimUbK1OkxNo5mVEjl4uZ6X+KlFg9Tl8YWNjsByVNUKWODZvaOb3sX77xTP+yTccnrNhkCgqqFGnRxgQp0b5UadGGIjVJ0gs8agAAgy0SUEHRABwAAAAASUVORK5CYII="
                                alt=""
                            />
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </>
    )
};

export default HeaderChat;