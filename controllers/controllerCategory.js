import { pool } from "../db/conection.js";

export const getAllCategories = async(req, res) => {
    try {
        pool.execute("SELECT * FROM categories", (err, results) => {
          if (err) {
            res.json("Error al realizar la consulta: " + err);
            return;
          }
          res.json(results);
        });
      } catch (error) {
        console.log(error);
      }
  
}
