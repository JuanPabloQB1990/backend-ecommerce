import { pool } from "../db/conection.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import {
  deleteImagesCloudinary,
  uploadImagesCloudinary,
} from "../utils/uploadImages.js";

export const getAllProducts = (req, res) => {
  try {
    pool.execute(
      "SELECT p.id, p.name AS name, p.description, p.images, p.id_category, p.price, p.quantity, p.rating, c.name AS category FROM `products` AS p INNER JOIN `categories` AS c ON c.id = p.id_category",
      (err, rows, fields) => {
        if (err instanceof Error) {
          throw new Error(err);
        }

        return res.json(rows);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = (req, res) => {
  try {
    pool.execute(
      "SELECT p.name AS name_product, p.description, p.images, p.id_category, p.price, p.quantity, p.rating, c.name AS name_category FROM `products` AS p INNER JOIN `categories` AS c ON c.id = p.id_category WHERE p.id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (err instanceof Error) {
          throw new Error(err);
        }

        return res.json(rows);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const postProduct = async (req, res) => {
  const { name, description, id_category, price, quantity, rating } = req.body;

  const paths = [];
  const files = req.files;

  const uploader = async (path) => await uploadImagesCloudinary(path, "products");

  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    paths.push(newPath);
  }

  try {
    pool.execute(
      "INSERT INTO `products`(`name`, `description`, `images` , `id_category`, `price`, `quantity`, `rating`) VALUES (?, ?, ?, ? ,?, ?, ?)",
      [name, description, paths, id_category, price, quantity, rating],
      (err) => {
        if (err) {
          throw new Error(err);
        }

        res.status(201).json({ message: "Producto guardado" });
      }
    );
  } catch (err) {
    console.log("Siguiente error: ", err);
  }
};

export const updateProduct = async(req, res) => {
  
  const { id, name, description, id_category, price, quantity, rating } = req.body;
  
  const paths = [];
  const files = req.files;

  if (req.files.length > 0) {
    try {
      pool.execute(
        "SELECT images FROM products WHERE id = ?",
        [req.body.id],
        (err, rows, fields) => {
          if (err instanceof Error) {
            throw new Error(err);
          }
          
          
          rows[0].images.forEach(row => {
            deleteImagesCloudinary(Object.keys(row)[0]);
          });

        }
      );

      const uploader = async (path) => await uploadImagesCloudinary(path, "products");

      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        paths.push(newPath);
      }

      pool.execute(
        "UPDATE `products` SET `name` = ?, `description` = ?, `images` = ? , `id_category` = ?, `price` = ?, `quantity` = ?, `rating` = ? WHERE `id` = ?",
        [name, description, paths, id_category, price, quantity, rating, id],
        (err, fields) => {
          if (err) {
            throw new Error(err);
          }
  
          if (fields.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
          }
  
          res.status(200).json({ message: "Producto Editado" });
        }
      );

    } catch (error) {
      console.log(error);
    }
  }else{

    try {
      pool.execute(
        "UPDATE `products` SET `name` = ?, `description` = ?, `id_category` = ?, `price` = ?, `quantity` = ?, `rating` = ? WHERE `id` = ?",
        [name, description, id_category, price, quantity, rating, id],
        (err, fields) => {
          if (err) {
            throw new Error(err);
          }
  
          if (fields.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
          }
  
          res.status(200).json({ message: "Producto Editado" });
        }
      );
    } catch (err) {
      console.log("Siguiente error: ", err);
    } 
  }

};

export const deleteProductById = (req, res) => {
  
  try {

    pool.execute(
      "SELECT images FROM `products` WHERE `id` = ?",
      [req.params.id],
      (err, rows) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        rows[0].images.forEach((row) => {
          deleteImagesCloudinary(Object.keys(row)[0]);
        });
        
      }
    );

    pool.execute(
      "DELETE FROM `products` WHERE `id` = ?",
      [req.params.id],
      (err, fields) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        return res.json({ message: "Producto eliminado" });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteProducts = (req, res) => {
  
  try {
    pool.execute(
      `SELECT images FROM products WHERE id IN(${req.body.ids.join(', ')})`,
      (err, rows) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        rows.forEach((row) => {
          row.images.forEach((image)=> {
            deleteImagesCloudinary(Object.keys(image)[0]);
          })
        })
        
      }
    );
 
    pool.execute(
      `DELETE FROM products WHERE id IN(${req.body.ids.join(', ')})`,
      (err) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        
        return res.json({ message: "Productos eliminados" });
      }
    );
     
  } catch (error) {
    console.log(error);
  } 
}

export const getAllProductsByCategory = (req, res) => {
  console.log(req.params);
  try {
    pool.execute(
      "SELECT p.id, p.name AS name, p.description, p.images, p.id_category, p.price, p.quantity, p.rating, c.name AS category FROM `products` AS p INNER JOIN `categories` AS c ON c.id = p.id_category WHERE p.id_category = ?",
      [req.params.id],
      (err, rows) => {
        if (err instanceof Error) {
          throw new Error(err);
        }
        console.log(err);
        console.log(rows);
        return res.json(rows);
      }
    );
  } catch (error) {
    console.log(error);
  }
}


