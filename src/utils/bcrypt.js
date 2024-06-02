import bcrypt from 'bcrypt'
import varenv from '../dotenv.js'

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varenv.salt))

export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd)


//pruebo el hasheo
//console.log(createHash("coderhouse"))


//pruebo la validacion
//let passEncript= createHash("coder")
//console.log(passEncript)



// es VALIDAD CONTRASEÑA

//En parametros ingreso (contraseña enviada x usuario sin encriptar, contraseña encriptada de la BDD) => comparo la cotraseña que me enviaron con .comprareSync//pruebo el hasheo
