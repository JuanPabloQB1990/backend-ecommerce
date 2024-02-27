import express from 'express';
import { config } from 'dotenv';
import routeUsers from './routes/routeUser.js';
import cors from 'cors'
import routerProducts from './routes/routeProduct.js';
import routerCart from './routes/routeCart.js';
import routerCategories from './routes/routeCategory.js';
config()

const app = express();

// Configuración de permisos CORS para métodos específicos

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use("/users", routeUsers)
app.use('/products', routerProducts)
app.use('/cart', routerCart)
app.use('/categories', routerCategories)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})