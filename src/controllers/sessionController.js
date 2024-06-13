import passport from 'passport'
import { userModel } from '../models/user.js'
import { sendEmailChangePassword } from '../utils/nodemailer.js'
import jwt from 'jsonwebtoken'
import { validatePassword, createHash} from '../utils/bcrypt.js'
import varenv from '../dotenv.js'

export const login = async (req, res) => {
    
        try {
            if (!req.user) {
                req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario o contraseña no validos`)

                return res.status(401).send("Usuario o contraseña NO validos")
            }
    
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }
            req.logger.info("Sesión iniciada correctamente")
            res.status(200).send("Usuario logueado correctamente")
    
        } catch (error) {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)
            res.status(500).send("Error al loguear usuario")
        }
    }

// ruta Current: verificando logueo de usuario, func. asincrona utiliz estrategia JWT
export const current = async (req, res) => {
    req.logger.info("Información del usuario logueado")
    res.status(200).send("Usuario logueado")
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario ya existente`)
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }
        req.logger.info("Usuario registrado correctamente")
        res.status(200).send("Usuario creado correctamente")

    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)
        res.status(500).send("Error al registrar usuario")
    }

}
// LOGOUT : cerrar sesion
export const logout = async (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)
            
            return res.status(500).send("Error al cerrar sesión")
        } else {
            req.logger.info("Sesión finalizada correctamente")

            res.status(200).redirect("/")
        }

    })

}
// ruta GitHub
export const sessionGithub = async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')

}
//ruta JWT 
export const testJWT = async (req, res) => {
    req.logger.info("Desde testJWT" + req.user)
    if (req.user.rol == 'User' || req.user.rol == "User Premiun"){
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)    

        res.status(403).send("Usuario NO autorizado")
    }else
        req.logger.info("Usuario NO autorizado")
        res.status(200).send(req.user)
}

//ruta reestablecer Contraseña
export const changePassword = async( req, res) => {
    const { token } = req.params
    const { newPassword}  = req.body

    try {
        const validateToken = jwt.verify(token.substr(6,), varenv.jwt_secret )
        const user = userModel.findOne({ email: validateToken.userEmail })
        if(user) {
            if (!validatePassword(newPassword, user.password)) {
                const hashPassword = createHash(newPassword)
                user.password = hashPassword
                const resultado = await userModel.findByIdAndUpdate(user._id, user )
                console.log(resultado)
                res.status(200).send("Contraseña modificada correctamente")
            }else {
                res.status(400).send("Contraseña diferente a la anterior")
                // Contraseñas iguales
            }
        } else {
            // usuario no existe
            res.status(404).send("Usuario no encontrado")
        }
    } catch(e) {
        console.log(e)
        if(e?.message == 'jwt expired') {
            res.status(400).send("Expiró el tiempo del Token. Se enviará otro email con nuevo token")
        }
            res.status(500).send("e")


    }
}
//ruta envio de email 
export const sendEmailPassword = async (req, res) => {
    try {
        const { email } = req.body
    //console.log(req.user.email)
        const user = await userModel.findOne(user => user.email == email) 

        if (user) {
            const token = jwt.sign({userEmail: email}, varenv.jwt_secret, { espiresIn: '1h'})
            const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`
            sendEmailChangePassword(email, resetLink ) //(  ,"https://www.google.com/")
            res.status(200).send("Email enviado correctamente")
        } else {
            res.status(404).send("Usuario NO Encontrado")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("e")
    }
    
}

/* **********REESTABLECER CONTRASEÑA ********

// // Función asíncrona para manejar la solicitud de cambio de contraseña cuando se hace clic en esta ruta.
export const changePassword = async (req, res) => {
    const{email} = req.body//tomamos el email del body
    sendEmailChangePassword(email, "https://www.google.com/")
    //cuanda haga click en la ruta voy a consultar el email.
    // Imprime el correo electrónico del usuario en la consola
   // console.log(req.user.email)
    // Verifica si el usuario tiene permisos de 'premium'.
   // if (req.user.rol == 'premium')
        res.status(200).send("Tiene un 15% de descuento por ser usuario premium");  
}
*/