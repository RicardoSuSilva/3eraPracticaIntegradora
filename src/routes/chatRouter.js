import { Router } from 'express'

const chatRouter = Router()

chatRouter.get('/', (req, res) => { 
    res.render("templates/chat", {
        css: 'chat.css'
    }) 
})

export default chatRouter