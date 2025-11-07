import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

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

// Buscar concessionária pelo slug (para vitrine pública)
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const resultado = await pool.query(
      "SELECT * FROM concessionarias WHERE slug = $1",
      [slug]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: "Concessionária não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao buscar concessionária:", error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

// Atualizar tema (cores e logo) da concessionária
router.put("/tema/:id", async (req, res) => {
  const { id } = req.params;
  const { cor_primaria, cor_secundaria, logo_url, banner_url } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE concessionarias
       SET cor_primaria = $1,
           cor_secundaria = $2,
           logo_url = $3,
           banner_url = $4
       WHERE id = $5
       RETURNING *`,
      [cor_primaria, cor_secundaria, logo_url, banner_url, id]
    );

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Erro ao atualizar tema:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar tema da concessionária" });
  }
});

export default router;
