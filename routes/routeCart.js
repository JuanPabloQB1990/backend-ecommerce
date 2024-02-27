import express from 'express'
import { addToCart, deleteProductToCartById, getProductsByIdClient, updateQuantity } from '../controllers/controllerCart.js'
import { validarToken } from '../utils/token.js'


const router = express.Router()

router.post('/', validarToken, addToCart)
router.delete('/:id', validarToken, deleteProductToCartById)
router.get('/:id', validarToken, getProductsByIdClient)
router.put('/',validarToken, updateQuantity)

export default router
