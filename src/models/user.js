import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        default: "User"
    },

    isLoggedIn: {
        type: Boolean, 
        default: false
      },

      cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})
/*Define un middleware pre-save para el modelo userSchema, que se ejecuta antes de guardar un nuevo documento de usuario
userSchema.pre('save', async function (next) {
    try {
        // Crea un nuevo documento de carrito con un array de productos vacío
        const newCart = await cartModel.create({ products: [] })
        // Registra el documento de carrito recién creado
        console.log(newCart)
        // Asigna el _id del nuevo documento de carrito al campo cart_id del documento de usuario actual
        this.cart_id = newCart._id
    } catch (e) {
        // Si ocurre un error, pásalo al siguiente middleware en la cadena
        //NEXT se usa para continuar
        next(e)
    }
})

// Define un middleware pre-find para el modelo userSchema, que se ejecuta antes de buscar documentos de usuario
userSchema.pre('find', async function (next) {
    try {
        // Encuentra un documento de carrito por su _id
        const PRODS = await cartModel.findOne({ _id: '65f61c1cb5793c2ca93ed7f9' })
        // Registra el documento de carrito encontrado
        console.log(PRODS)
        // Rellena el campo 'cart_id' del documento de usuario actual con el documento de carrito referenciado
        this.populate('cart_id')
    } catch (e) {
        // Si ocurre un error, pásalo al siguiente middleware en la cadena
        next(e)
    }
})


//exporto una constante que va a ser igual a este modelo de nombre users y el siguiente esquema: userSchema*/

export const userModel = model("users", userSchema)