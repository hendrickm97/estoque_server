import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { pool } from "./db";

const app = express();

const port = process.env.PORT ?? 5000;

dotenv.config();

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("select * from produtos");
    res.json({ data: rows });
  } catch (error) {
    res.json(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const { nome, categoria, quantidade, valor_unitario } = req.body;

    const q =
      "INSERT INTO produtos(nome, categoria, quantidade, valor) VALUES($1, $2, $3, $4) RETURNING *";

    const { rows } = await pool.query(q, [
      nome,
      categoria,
      quantidade,
      valor_unitario,
    ]);

    res.json({ data: rows[0] });
  } catch (error) {
    res.json(error);
  }
});

app.delete("/", async (req, res) => {
  try {
    const q = "DELETE FROM produtos where id = $1 RETURNING *";

    const { rows } = await pool.query(q, [req.params]);

    if (rows[0]) {
      return res.json("Seu produto foi deletado com Sucesso!");
    }
    return res.status(404).json("Produto não foi encontrado!");
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => console.log("Server is running on port 5000!"));
