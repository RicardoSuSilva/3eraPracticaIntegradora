import cartRouter from './cartRouter.js'
import productsRouter from './productsRouter.js'
import userRouter from './userRouter.js'
import chatRouter from './chatRouter.js'
import sessionRouter from './sessionRouter.js'
import multerRouter from './multerRouter.js'
import express from 'express'
import mockRouter from './mockRouter.js'
import { __dirname } from '../path.js'
import passport from 'passport'
import { loggerTest } from '../utils/logger.js'

const indexRouter = express.Router()

//Routes
indexRouter.get('/', (req, res) => {
    try{
        res.status(200).send("Bienvenido/a!")     
    } catch (error) {
        req.logger.error(`Metodo: ${req.method} en ruta ${req.url} - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        res.status(500).send(error)
    }
    
})

indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/upload', multerRouter)
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)
indexRouter.use('/mockingproducts', mockRouter)
indexRouter.get('/mockingusers', mockRouter)
indexRouter.get('/api/loggerTest', loggerTest)


export default indexRouter