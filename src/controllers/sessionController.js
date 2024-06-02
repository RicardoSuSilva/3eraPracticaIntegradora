import passport from "passport";
import { userModel } from '../models/user.js';
import { sendEmailChangePassword } from '../utils/nodemailer.js';
import jwt from 'jsonwebtoken'
import { validatePassword, createHash} from '../utils/bcrypt.js'
import varenv from '../dotenv.js'

export const login = async (req, res) => {
    
        try {
            if (!req.user) {
                return res.status(401).send("Usuario o contraseña no validos")
            }
    
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }
    
            res.status(200).send("Usuario logueado correctamente")
    
        } catch (e) {
            res.status(500).send("Error al loguear usuario")
        }
    }

// ruta Current: verificando logueo de usuario, func. asincrona utiliz estrategia JWT
export const current = async (req, res) => {
    try {
        if (req.user) {
            console.log(req)
            res.status(200).send("Usuario logueado");
        } else {
            res.status(401).send("Usuario no autenticado");
        }
    } catch (e) {
        res.status(500).send("Error al verificar usuario actual");
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }

        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
    }

}
// LOGOUT : cerrar sesion
export const logout = async (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
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
    console.log("Desde testJWT" + req.user)
    if (req.user.rol == 'User')
        res.status(403).send("Usuario no autorizado")
    else
        res.status(200).send(req.user)
}

//ruta Nueva Contraseña
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
            res.status(500).send(e)


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
        res.status(500).send(e)
    }
    
}