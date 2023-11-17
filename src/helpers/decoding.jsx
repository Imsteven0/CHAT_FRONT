import jwtDecode from 'jwt-decode'

export const getFullName = token => {
    const {name} = jwtDecode(token)
    //console.log("name", name)
    return name
}

export const getIdUser = token => {
    const {user_id} = jwtDecode(token)
    //console.log("EXP", user_id)
    return user_id
}

export const getExpiresIn = token => {
    const {exp} = jwtDecode(token)
    //console.log("EXP", exp)
    return exp
}

export const getImage = token => {
    const {image} = jwtDecode(token)
    //console.log("image", image)
    return image
}