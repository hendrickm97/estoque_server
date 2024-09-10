import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("select * from produtos");
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro interno do servidor" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM produtos WHERE id = $1", [
      req.params.id,
    ]);

    if (rows[0]) {
      return res.json({ data: rows });
    }

    res.status(404).json({ msg: "Produto não encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro interno do servidor" });
  }
}),
  app.post("/", async (req, res) => {
    try {
      const { nome, categoria, quantidade, valorUnitario } = req.body;

      const q =
        "INSERT INTO produtos(nome, categoria, quantidade, valor) VALUES($1, $2, $3, $4) RETURNING *";

      const { rows } = await pool.query(q, [
        nome,
        categoria,
        quantidade,
        valorUnitario,
      ]);

      res.status(201).json({ data: rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Erro interno do servidor" });
    }
  });

app.delete("/:id", async (req, res) => {
  try {
    const q = "DELETE FROM produtos WHERE id = $1 RETURNING *";

    const { rows } = await pool.query(q, [req.params.id]);

    if (rows[0]) {
      return res.json("Seu produto foi deletado com Sucesso!");
    }
    return res.status(404).json("Produto não foi encontrado!");
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => console.log("Server is running on port 5000!"));
