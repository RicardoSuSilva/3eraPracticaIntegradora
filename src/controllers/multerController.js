import upload from '../config/multer.js'

export const insertImg = (req, res) => {
    try {
        req.logger.info(`La imagen se cargó correctamente: ${req.file}`)

        res.status(200).send("Imagen cargada correctamente")
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${error.message}`)
        res.status(500).send("Error al cargar imagen")
    }
}