import express from "express";
import { pool } from "../config/db.js";
import {
  cadastrarVeiculo,
  listarVeiculos,
  atualizarVeiculo,
  excluirVeiculo,
} from "../controllers/veiculosController.js";
import { autenticarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cadastrar", autenticarToken, cadastrarVeiculo);
router.get("/meus", autenticarToken, listarVeiculos);
router.put("/:id", autenticarToken, atualizarVeiculo);
router.delete("/:id", autenticarToken, excluirVeiculo);

// Listar veículos de uma concessionária pelo slug
router.get("/concessionaria/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const resultado = await pool.query(
      `SELECT v.*
       FROM veiculos v
       INNER JOIN concessionarias c ON v.concessionaria_id = c.id
       WHERE c.slug = $1`,
      [slug]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar veículos por concessionária:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// Buscar veículo pelo ID (para página de detalhes pública)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query(
      "SELECT * FROM veiculos WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Veículo não encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao buscar veículo:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


export default router;
