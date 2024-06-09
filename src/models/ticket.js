import { Schema, model } from 'mongoose'

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: [
        {
            type: Object
            //type: Schema.Types.ObjetId,
            //ref: 'products'
            
        }
    ]
})

const ticketModel = model('ticket', ticketSchema)

export default ticketModel