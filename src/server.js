import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import veiculosRoutes from "./routes/veiculosRoutes.js";
import concessionariasRoutes from "./routes/concessionariasRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/veiculos", veiculosRoutes);
app.use("/api/concessionarias", concessionariasRoutes);


// Rota de teste
app.get("/", (req, res) => {
  res.send("🚗 API do Catálogo Automotivo em funcionamento!");
});

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  }
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
