import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ mensagem: "Token não fornecido." });

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      // Ajuda no diagnóstico
      return res.status(403).json({
        mensagem: "Token inválido ou expirado.",
        detalhe: erro.name, // ex: JsonWebTokenError, TokenExpiredError
      });
    }
    req.usuario = usuario;
    next();
  });
};
