import express from 'express'
import { validarToken } from '../utils/token.js'
import { getAllCategories } from '../controllers/controllerCategory.js'
const router = express.Router()

router.get("/", validarToken, getAllCategories)

export default router