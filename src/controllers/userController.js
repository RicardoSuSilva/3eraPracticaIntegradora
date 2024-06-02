import { userModel } from "../models/user.js";
import { createRandomUser } from "../mockings/mockingUsers.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (e) {
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
