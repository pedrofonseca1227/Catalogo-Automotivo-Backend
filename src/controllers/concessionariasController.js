import { pool } from "../config/db.js";

// Cadastrar nova concessionária
export const cadastrarConcessionaria = async (req, res) => {
  const { nome, slug, cnpj, email, telefone, endereco, logo_url, plano } = req.body;
  const usuario_id = req.usuario.id;

  try {
    // Cadastra a concessionária
    const resultado = await pool.query(
      `INSERT INTO concessionarias (nome, slug, cnpj, email, telefone, endereco, logo_url, plano)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [nome, slug, cnpj, email, telefone, endereco, logo_url, plano || "gratuito"]
    );

    const concessionariaId = resultado.rows[0].id;

    // Vincula o usuário à concessionária criada
    await pool.query("UPDATE usuarios SET concessionaria_id = $1 WHERE id = $2", [
      concessionariaId,
      usuario_id,
    ]);

    res.status(201).json({
      mensagem: "Concessionária cadastrada com sucesso!",
      concessionaria_id: concessionariaId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar concessionária:", erro);
    res.status(500).json({ mensagem: "Erro ao cadastrar concessionária." });
  }
};

// Buscar dados da concessionária do usuário logado
export const minhaConcessionaria = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const usuario = await pool.query(
      "SELECT concessionaria_id FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].concessionaria_id) {
      return res.status(404).json({ mensagem: "Usuário não possui concessionária cadastrada." });
    }

    const concessionariaId = usuario.rows[0].concessionaria_id;
    const resultado = await pool.query(
      "SELECT * FROM concessionarias WHERE id = $1",
      [concessionariaId]
    );

    res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar concessionária:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar concessionária." });
  }
};
