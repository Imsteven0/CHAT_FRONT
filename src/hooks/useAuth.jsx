import {createContext, useContext, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useLocalStorage} from './useLocalStorage'
import {getExpiresIn, getFullName, getIdUser} from '../../../Portafolio-Steven/src/helpers/decoding'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [token, setToken] = useLocalStorage('token', null)
    const [user, setUser] = useLocalStorage('user', null)
    const [idUser, setIdUser] = useLocalStorage('idUser', null)
    const [expiresIn, setExpiresIn] = useLocalStorage('expiresIn', null)

    const navigate = useNavigate()

    const login = async (token) => {
        console.log("TOKEN", token)
        setToken(token)
        setUser(getFullName(token))
        setIdUser(getIdUser(token))
        setExpiresIn(getExpiresIn(token))
        navigate('/', {replace: true})
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        setExpiresIn(null)
        navigate('/', {replace: true})
    }

    const value = useMemo(
        () => ({
            token,
            user,
            idUser,
            expiresIn,
            login,
            logout,
        }),
        [user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}
