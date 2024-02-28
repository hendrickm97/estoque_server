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
  const q =
    "INSERT INTO produtos(nome, categoria, quantidade, valor) VALUES($1, $2, $3, $4) Returning*";
  const values = [
    req.body.nome,
    req.body.categoria,
    req.body.quantidade,
    req.body.valor,
  ];
  await pool.query(q, [values], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Produto cadastrado com sucesso.");
  });
});

app.listen(port, () => console.log("Server is running on port 5000!"));
