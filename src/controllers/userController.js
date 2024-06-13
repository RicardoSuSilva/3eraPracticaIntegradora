import { userModel } from '../models/user.js'
import { createRandomUser } from '../mockings/mockingUsers.js'

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        req.logger.info("usuarios consultados correctamente")
        res.status(200).send(users)
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)
        res.status(500).send("Error al consultar users: ", e)
    }

}
// Genera productos aleatorio carpeta mockings
export const generateRandomUsers = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(createRandomUser());
    }
    return products;
};
