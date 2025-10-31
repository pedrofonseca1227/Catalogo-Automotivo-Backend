import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ==============================
// CADASTRAR NOVO USUÁRIO
// ==============================
export const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    // verifica se já existe
    const existente = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (existente.rows.length > 0) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado." });
    }

    // criptografa senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // insere no banco
    await pool.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)",
      [nome, email, senhaHash, tipo || "concessionaria"]
    );

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
};

// ==============================
// LOGIN
// ==============================
export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensagem: "Usuário não encontrado." });
    }

    const valido = await bcrypt.compare(senha, usuario.rows[0].senha);
    if (!valido) {
      return res.status(401).json({ mensagem: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.rows[0].id, email: usuario.rows[0].email, tipo: usuario.rows[0].tipo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      mensagem: "Login bem-sucedido!",
      token,
      usuario: {
        id: usuario.rows[0].id,
        nome: usuario.rows[0].nome,
        email: usuario.rows[0].email,
        tipo: usuario.rows[0].tipo,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).json({ mensagem: "Erro ao fazer login." });
  }
};

// ==============================
// PERFIL (Rota Protegida)
// ==============================
export const perfilUsuario = async (req, res) => {
  try {
    const usuario = await pool.query("SELECT id, nome, email, tipo FROM usuarios WHERE id = $1", [req.usuario.id]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    res.status(200).json(usuario.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar perfil." });
  }
};
