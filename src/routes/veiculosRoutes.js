import express from "express";
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

export default router;
