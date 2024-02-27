import express from 'express'
import { deleteProductById, deleteProducts, getAllProducts, getProductById, postProduct, updateProduct, getAllProductsByCategory } from '../controllers/controllerProduct.js'
import { validarToken } from '../utils/token.js'
import { authorizateAdmin } from '../utils/validateAdmin.js'
import { upload } from '../utils/uploadMulter.js'

const router = express.Router()

router.get('/', validarToken, getAllProducts)
router.get('/:id', validarToken, getAllProductsByCategory)
router.get('/product/:id', validarToken, getProductById)
router.post("/",  upload.array("images"), postProduct)
router.put("/product", upload.array("images"), validarToken, authorizateAdmin, updateProduct)
router.delete("/product/:id", validarToken, authorizateAdmin, deleteProductById)
router.delete("/", validarToken, authorizateAdmin, deleteProducts)

export default router