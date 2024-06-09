import varenv from '../../../dotenv.js'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { userModel } from '../../../models/user.js'

const cookieExtractor = req => {
    console.log(req.cookies)
    //{} no hay cookies != esta cookie no existe
    //Si existen cookies, asigno mi cookie en especifico
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

// console.log(varenv.jwt_secret)

/*** ESTRATEGIAS JWT *** */

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() esperar el token de JWT desde la peticion
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) consultando desde las cookies
    secretOrKey: varenv.jwt_secret
}

export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log(payload);
        const user = await userModel.findById(payload.user._id)
        console.log(user);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, null);
    }
})