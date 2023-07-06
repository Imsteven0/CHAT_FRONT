export const compareDates = (epoch) => {
    const dateNow = new Date()
    const expiresIn = new Date(epoch * 1000)
    return expiresIn > dateNow
}

