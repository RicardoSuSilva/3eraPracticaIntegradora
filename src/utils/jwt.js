import varenv from '../dotenv.js'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {

    /*
        1°: Objeto de asociacion del token (Usuario)
        2°: Clave privada del cifrado
        3°: Tiempo de expiracion
    */
    const token = jwt.sign({ user },varenv.jwt_secret, { expiresIn: '12h' })
                                /*,"coderhouse",*/
    return token

}

console.log(generateToken({
    "_id": "6606f43d8cfe81bda948c07c",
    "first_name": "Ricardo",
    "last_name": "Ruben",
    "password": "$2b$12$uP8yqGw8JgaHGFLbgc1UXu1PpiIzm2NN0PPBjIdacUlxzUaoujWOe",
    "age": 50,
    "email": "adminCodere@coder.com",
    "rol": "User",
    "__v": 0

}))