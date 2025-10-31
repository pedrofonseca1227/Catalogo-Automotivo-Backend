import { pool } from "../config/db.js";

// ================================
// CADASTRAR VEÍCULO
// ================================
export const cadastrarVeiculo = async (req, res) => {
  const {
    marca,
    modelo,
    ano,
    preco,
    quilometragem,
    cambio,
    combustivel,
    cor,
    descricao,
    imagem_url,
  } = req.body;

  const usuario_id = req.usuario.id;

  try {
    // Buscar o concessionaria_id do usuário logado
    const usuario = await pool.query(
      "SELECT concessionaria_id FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].concessionaria_id) {
      return res
        .status(403)
        .json({ mensagem: "Usuário não possui uma concessionária vinculada." });
    }

    const concessionaria_id = usuario.rows[0].concessionaria_id;

    // Inserir o veículo vinculado à concessionária
    await pool.query(
      `INSERT INTO veiculos (
        concessionaria_id, marca, modelo, ano, preco, quilometragem, cambio,
        combustivel, cor, descricao, imagem_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        concessionaria_id,
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        cambio,
        combustivel,
        cor,
        descricao,
        imagem_url,
      ]
    );
    console.log("🧩 concessionaria_id usado:", concessionaria_id);

    res.status(201).json({ mensagem: "✅ Veículo cadastrado com sucesso!" });
  } catch (erro) {
    console.error("❌ Erro ao cadastrar veículo:", erro);
    res.status(500).json({ mensagem: "Erro ao cadastrar veículo." });
  }
};

// ================================
// LISTAR VEÍCULOS DA CONCESSIONÁRIA LOGADA
// ================================
export const listarVeiculos = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const usuario = await pool.query(
      "SELECT concessionaria_id FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].concessionaria_id) {
      return res
        .status(403)
        .json({ mensagem: "Usuário não possui uma concessionária vinculada." });
    }

    const concessionaria_id = usuario.rows[0].concessionaria_id;

    const resultado = await pool.query(
      "SELECT * FROM veiculos WHERE concessionaria_id = $1 ORDER BY id DESC",
      [concessionaria_id]
    );

    res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error("❌ Erro ao listar veículos:", erro);
    res.status(500).json({ mensagem: "Erro ao listar veículos." });
  }
};

// ================================
// ATUALIZAR VEÍCULO
// ================================
export const atualizarVeiculo = async (req, res) => {
  const { id } = req.params;
  const {
    marca,
    modelo,
    ano,
    preco,
    quilometragem,
    cambio,
    combustivel,
    cor,
    descricao,
    imagem_url,
  } = req.body;

  const usuario_id = req.usuario.id;

  try {
    const usuario = await pool.query(
      "SELECT concessionaria_id FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].concessionaria_id) {
      return res
        .status(403)
        .json({ mensagem: "Usuário não possui uma concessionária vinculada." });
    }

    const concessionaria_id = usuario.rows[0].concessionaria_id;

    const resultado = await pool.query(
      `UPDATE veiculos SET
        marca=$1, modelo=$2, ano=$3, preco=$4, quilometragem=$5,
        cambio=$6, combustivel=$7, cor=$8, descricao=$9, imagem_url=$10
       WHERE id=$11 AND concessionaria_id=$12`,
      [
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        cambio,
        combustivel,
        cor,
        descricao,
        imagem_url,
        id,
        concessionaria_id,
      ]
    );

    if (resultado.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Veículo não encontrado ou sem permissão." });
    }

    res.status(200).json({ mensagem: "✅ Veículo atualizado com sucesso!" });
  } catch (erro) {
    console.error("❌ Erro ao atualizar veículo:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar veículo." });
  }
};

// ================================
// EXCLUIR VEÍCULO
// ================================
export const excluirVeiculo = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    const usuario = await pool.query(
      "SELECT concessionaria_id FROM usuarios WHERE id = $1",
      [usuario_id]
    );

    if (usuario.rows.length === 0 || !usuario.rows[0].concessionaria_id) {
      return res
        .status(403)
        .json({ mensagem: "Usuário não possui uma concessionária vinculada." });
    }

    const concessionaria_id = usuario.rows[0].concessionaria_id;

    const resultado = await pool.query(
      "DELETE FROM veiculos WHERE id=$1 AND concessionaria_id=$2",
      [id, concessionaria_id]
    );

    if (resultado.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Veículo não encontrado ou sem permissão." });
    }

    res.status(200).json({ mensagem: "✅ Veículo excluído com sucesso!" });
  } catch (erro) {
    console.error("❌ Erro ao excluir veículo:", erro);
    res.status(500).json({ mensagem: "Erro ao excluir veículo." });
  }
};
