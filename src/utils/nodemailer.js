import nodemailer from 'nodemailer'
import varenv from '../dotenv.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "richisusilva1@gmail.com",
        pass: varenv.pass
    }
})

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOption = {
        from: "richisusilva1@gmail.com",
        to: email,
        subject: "Recuperacion de contraseña",
                 
        html: 
        `
        <p>Haz click aquí para cambiar tu contraseña: </p> <button><a href=${linkChangePassword}>
        Cambiar contraseña</a></button>
        `
    }

    transporter.sendMail(mailOption, (error, info) => {
        if(error) {
            console.log("Error al enviar correo de cambio de contraseña")
        } else{
            console.log("Email enviado correctamente", info.response)
        }

    })
}
