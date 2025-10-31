import express from "express";
import { cadastrarConcessionaria, minhaConcessionaria } from "../controllers/concessionariasController.js";
import { autenticarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cadastrar", autenticarToken, cadastrarConcessionaria);
router.get("/minha", autenticarToken, minhaConcessionaria);

export default router;
