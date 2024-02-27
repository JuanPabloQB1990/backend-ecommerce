import { pool } from "../db/conection.js";

export const addToCart = (req, res) => {
  console.log(req.body);

  const { id_client, id_product, quantity, total } = req.body;

  const newTotal = quantity * total

  try {

    pool.execute(
      "SELECT quantity FROM cart WHERE id_product = ? AND id_client = ?",
      [id_product, id_client],
      (err, rows) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        if (rows.length > 0) {
          console.log(Object.values(rows[0])[0]);

          const newQuantity = quantity + Object.values(rows[0])[0]
          console.log(newQuantity);
          pool.execute(
            "UPDATE `cart` SET `quantity` = ?, `total` = ? WHERE `id_product` = ? AND id_client = ?",
            [newQuantity, newTotal, id_product, id_client],
            (err, fields) => {
              if (err) {
                throw new Error(err);
              }
      
              if (fields.affectedRows === 0) {
                return res.status(404).json({ message: "producto no encontrado" });
              }
      
              res.status(200).json({ message: "Cantidad Editado en el carrito" });
            }
          );
        }else{
          pool.execute(
            "INSERT INTO `cart`(`id_client`, `id_product`, `quantity`, `total`) VALUES (?, ?, ?, ?)",
            [id_client, id_product, quantity, newTotal],
            (err) => {
              
              if (err) {
                throw new Error(err);
              }
              
              res.json({ message: "producto agregado al carrito" });
            }
            );

        }
        
      }
    );

    } catch (error) {
      res.json({ message: "Error en el servidor" });
  }
};

export const deleteProductToCartById = (req, res) => {
  try {
    pool.execute(
      "DELETE FROM `cart` WHERE `id` = ?",
      [req.params.id],
      (err) => {
        if (err instanceof Error) {
          throw new Error(err);
        }

        return res.json({ message: "Producto eliminado del carrito" });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getProductsByIdClient = (req, res) => {
    
  try {
    pool.execute(
      "SELECT c.id, c.total, p.name AS name_product, p.description, p.images, p.id_category, p.price, p.quantity AS quantity_product, p.rating, ca.name AS name_category, c.quantity AS quantity_cart FROM `cart` AS c inner join `users` AS u on c.id_client = u.id inner join `products` AS p on c.id_product = p.id inner join `categories` AS ca on ca.id = p.id_category where c.id_client = ?",
      [req.params.id],
      (err, rows) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        if (rows[0]) {
            return res.json(rows);
        }

        res.status(404).json({message: "Tu carrito esta vacio"})
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateQuantity = (req, res) => {
    console.log(req.body);
    const { quantity, id, price } = req.body

    const newTotal = quantity * price
    try {
        pool.execute(
          "UPDATE `cart` SET `quantity` = ?, `total` = ? WHERE `id` = ?",
          [quantity, newTotal, id],
          (err, fields) => {
            if (err) {
              throw new Error(err);
            }
    
            if (fields.affectedRows === 0) {
              return res.status(404).json({ message: "pedido no encontrado" });
            }
    
            res.status(200).json({ message: "Cantidad Editado" });
          }
        );
      } catch (err) {
        console.log("Siguiente error: ", err);
      }
}
