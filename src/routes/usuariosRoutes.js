import express from "express";
import { cadastrarUsuario, loginUsuario, perfilUsuario } from "../controllers/usuariosController.js";
import { autenticarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cadastro
router.post("/cadastrar", cadastrarUsuario);

// Login
router.post("/login", loginUsuario);

// Perfil (rota protegida)
router.get("/perfil", autenticarToken, perfilUsuario);

export default router;
