import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";
import userModel from "../models/user.js";

//crear carrito
export const createCart = async (req, res) => {
    try {
        const cart = await cartModel.create({ products: [] })

        req.logger.info("Carrito creado correctamente")

        res.status(201).send(cart)
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al crear carrito")
    }
}

//mostrar carrito
export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({ _id: cartId })

        let productosProcesados = cart.products.map(producto => ({
            title: producto.id_prod.title,
            quantity: producto.quantity
        }));

        req.logger.info("Carrito obtenido correctamente")

        res.status(200).render('templates/cart', {
            productos: productosProcesados
        })
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al consultar carrito")
    }
}


//generar ticket
export const createTicket = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)
        const user = await userModel.findById(req.user._id)

        if (!user) {
            req.logger.error(`Usuario no encontrado`);
            return res.status(404).send("Usuario no encontrado");
        }
        
        let prodSinStock = []
        if (cart) {
            cart.products.forEach(async (prod) => {
                let producto = await productModel.findById(prod.id_prod)
                if (producto.stock - prod.quantity < 0) {
                    prodSinStock.push(producto.id)
                }
            })
            if (prodSinStock.length == 0) {
                let totalPrice = 0;
                
                for (const prod of cart.products) {
                    let producto = await productModel.findById(prod.id_prod);
                    totalPrice += producto.price * prod.quantity;
                }

                if (user.rol == 'UserPremium') {
                    //aplicar 15% de descuento
                    totalPrice *= 0.85
                }

                const newTicket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    purchaser: req.user.email,
                    amount: totalPrice,
                    products: cart.products
                })
                await cartModel.findByIdAndUpdate(cartId, {
                    products: []
                })

                req.logger.info(`Ticket creado correctamente: ${newTicket}`)

                res.status(200).send(`Ticket creado correctamente: ${newTicket}`)
            } else {
                prodSinStock.forEach((prodId) => {
                    cart.products = cart.products.filter(pro => pro.id_prod !== prodId)
                })
                await cartModel.findByIdAndUpdate(cartId, {
                    products: cart.products
                })
                req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Algunos productos no tienen stock`)

                res.status(400).send(`Productos sin stock: ${prodSinStock}`)
            }
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: El carrito que buscas no exite`)

            res.status(404).send("Carrito no existe")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al crear ticket")
    }
}

//ingresar productos al carrito
export const insertProductCart = async (req, res) => {
    try {
        if (req.user.rol == "User" || req.user.rol == "UserPremium") {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body

            if (!quantity || isNaN(quantity)) {
                quantity = 1;
            }

            const cart = await cartModel.findById(cartId)
            const indice = cart.products.findIndex(product => product.id_prod.toString() === productId)


            if (indice != -1) {
                cart.products[indice].quantity += parseInt(quantity)
            } else {
                cart.products.push({ id_prod: productId, quantity: quantity })
            }
            const carrito = await cartModel.findByIdAndUpdate(cartId, cart)

            req.logger.info("Producto/s agregado/s correctamente al carrito")

            res.status(200).send(carrito)
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al agregar producto")
    }
}

//actualizar el carrito
export const updateCart = async (req, res) => {
    try {
        if (req.user.rol == "User" || req.user.rol == "UserPremium") {
            const cartId = req.params.cid;
            const { products } = req.body;
            const cart = await cartModel.findByIdAndUpdate(cartId, { products }, { new: true });

            req.logger.info("Carrito actualizado correctamente")

            res.status(200).send(cart);
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al actualizar el carrito");
    }
}

//actualizar la cantidad de un producto
export const updateQuantity = async (req, res) => {
    try {
        if (req.user.rol == "User" || req.user.rol == "UserPremium") {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            let { quantity } = req.body;

            if (!quantity || isNaN(quantity)) {
                quantity = 1;
            }
            const cart = await cartModel.findById(cartId);
            const index = cart.products.findIndex(product => product.id_prod.toString() === productId);
            if (index !== -1) {
                cart.products[index].quantity += parseInt(quantity);
                await cart.save();

                req.logger.info("Cantidad actualizada correctamente")

                res.status(200).send(cart);
            } else {
                req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: No se encontró el producto que buscas`)

                res.status(404).send('Producto no encontrado en el carrito');
            }
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }

    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al actualizar la cantidad del producto");
    }
};

//eliminar un producto del carrito
export const deleteProductCart = async (req, res) => {
    try {
        if (req.user.rol == "User" || req.user.rol == "UserPremium") {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart = await cartModel.findById(cartId);
            cart.products = cart.products.filter(products => products.id_prod.toString() !== productId);
            await cart.save();

            req.logger.info("Producto eliminado del carrito")

            res.status(200).send(cart);
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            req.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al eliminar el producto del carrito");
    }
}

//vaciar el carrito
export const emptyCart = async (req, res) => {
    try {
        if (req.user.rol == "User" || req.user.rol == "UserPremium") {
            const cartId = req.params.cid;
            const cart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });

            req.logger.info("Carrito vaciado correctamente")

            res.status(200).send(cart);
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al eliminar todos los productos del carrito");
    }
}

