import productModel from '../models/product.js'
import { createRandomProduct } from '../mockings/mockingProducts.js'

export const getProducts = async (req, res) => {
    console.log(req)
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });

        const productos = prods.docs.map(producto => producto.toObject());

        req.logger.info(`Productos obtenidos con éxito: ${prods}`)

       // res.status(200).send(prods)
        res.status(200).render('templates/index', {
            mostrarProductos: true,
            productos: productos,
            css: 'index.css',
        })

    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}. Error al obtener productos: ${error.message}`)
        res.status(500).render('templates/error', {
            error: error,
        });
    }

}
// Mostrar Producto por ID
export const getProduct = async (req, res) => {
    try {
        const idProducto = req.params.pid 
        const prod = await productModel.findById(idProducto)
        if (prod) {
            req.logger.info("Producto encontrado")

            res.status(200).send(prod)
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: El producto que buscas no existe`)

            res.status(404).send("Producto no existe")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al consultar producto")
    }
}

//crear un producto
export const createProduct = async (req, res) => {
    try {
        if (req.user.rol == "Admin") {
            const product = req.body
            const prod = await productModel.create(product)

            req.logger.info("Producto creado correctamente")

            res.status(201).send(prod)
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al crear producto")
    }
}

//actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        if (req.user.rol == "Admin") {
            const idProducto = req.params.pid
            const updateProduct = req.body
            const prod = await productModel.findByIdAndUpdate(idProducto, updateProduct)

            req.logger.info("Producto actualizado correctamente")

            res.status(200).send(prod)    
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send("Error interno del servidor al actualizar producto")
    }
}

//eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        if (req.user.rol == "Admin") {
            const idProducto = req.params.pid
            const prod = await productModel.findByIdAndDelete(idProducto)
            
            req.logger.info("Producto eliminado correctamente")
            res.status(200).send(prod)
        } else {
            req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: Usuario no autorizado`)

            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)

        res.status(500).send(`Error interno del servidor al eliminar producto`)
    }
}