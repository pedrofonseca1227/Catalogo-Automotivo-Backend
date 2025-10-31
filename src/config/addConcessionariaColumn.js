import { pool } from "./db.js";

const addColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN concessionaria_id INT REFERENCES concessionarias(id);
    `);
    console.log("✅ Coluna concessionaria_id adicionada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao adicionar coluna:", err.message);
  } finally {
    pool.end();
  }
};

addColumn();
