import cartModel from '../models/cart.js'
import productModel from '../models/product.js'
import ticketModel from '../models/ticket.js'

// obtener un carrito por su ID
export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({ _id: cartId });
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
}
// Función asíncrona para crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        // Crea un nuevo carrito con un array de productos vacío
        const mensaje = await cartModel.create({ products: [] });
        // Envía un mensaje de confirmación al cliente con un código de estado 201 (Created)
        res.status(201).send(mensaje);
    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`);
    }
}
// Función asíncrona para insertar un producto en un carrito
export const insertProductCart = async (req, res) => {
    try {
        if (req.user.rol == "User") {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;
            const cart = await cartModel.findById(cartId);

            // Encuentra el índice del producto en el carrito
            const indice = cart.products.findIndex(product => product.id_prod == productId);
            if (indice != -1) {
                cart.products[indice].quantity = quantity;
            } else {
                cart.products.push({ id_prod: productId, quantity: quantity });
            }
            const mensaje = await cartModel.findByIdAndUpdate(cartId, cart);
            res.status(200).send(mensaje);
        } else {
            res.status(403).send("Usuario NO autorizado");
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
}

// Función asíncrona para crear un ticket de compra
export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId);
        const prodSinStock = [];

        if (cart) {
            cart.products.forEach(async (prod) => {
                let producto = await productModel.findById(prod.id_prod);
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto);
                }
            });
            if (prodSinStock.length == 0) {
                const totalPrice = cart.products.reduce((a, b) => (a.price * a.quantity) + (b.price * b.quantity), 0);
                
                let productPrice = producto.price * prod.quantity;

                // Aplicar descuento del 15% si el cliente es premium
                if (req.user && req.user.rol === "Premium") {
                    productPrice *= 0.85; // Aplicar el descuento del 15%
                }

                totalPrice += productPrice;
            }
                // Genera un nuevo ticket
                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,
                    products: cart.products
                });

                res.status(200).send(newTicket);      
        
    } else {
        res.status(404).send("Carrito NO existe");
    }
} catch (e) {
    res.status(500).send(e);
}
}
