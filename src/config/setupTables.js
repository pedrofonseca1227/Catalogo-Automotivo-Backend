import { pool } from './db.js';

const criarTabelas = async () => {
  try {
    await pool.query(`
      -- ==========================
      -- 1. Usuários (clientes)
      -- ==========================
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(20) DEFAULT 'concessionaria', -- admin / concessionaria / funcionario
        ativo BOOLEAN DEFAULT TRUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ==========================
      -- 2. Concessionárias
      -- ==========================
      CREATE TABLE IF NOT EXISTS concessionarias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL, -- usado para subdomínios (ex: autocar)
        cnpj VARCHAR(20),
        email VARCHAR(100),
        telefone VARCHAR(30),
        endereco TEXT,
        logo_url TEXT,
        plano VARCHAR(20) DEFAULT 'gratuito', -- gratuito / premium
        ativo BOOLEAN DEFAULT TRUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ==========================
      -- 3. Funcionários das Concessionárias
      -- ==========================
      CREATE TABLE IF NOT EXISTS funcionarios_concessionaria (
        id SERIAL PRIMARY KEY,
        usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
        concessionaria_id INT REFERENCES concessionarias(id) ON DELETE CASCADE,
        cargo VARCHAR(50),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ==========================
      -- 4. Veículos
      -- ==========================
      CREATE TABLE IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        concessionaria_id INT REFERENCES concessionarias(id) ON DELETE CASCADE,
        marca VARCHAR(50) NOT NULL,
        modelo VARCHAR(100) NOT NULL,
        ano INT NOT NULL,
        preco NUMERIC(12,2),
        quilometragem INT,
        cambio VARCHAR(20),
        combustivel VARCHAR(20),
        cor VARCHAR(30),
        descricao TEXT,
        imagem_url TEXT, -- imagem principal
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ==========================
      -- 5. Imagens adicionais dos veículos
      -- ==========================
      CREATE TABLE IF NOT EXISTS imagens_veiculos (
        id SERIAL PRIMARY KEY,
        veiculo_id INT REFERENCES veiculos(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        principal BOOLEAN DEFAULT FALSE
      );

      -- ==========================
      -- 6. Mensagens de interesse (visitantes)
      -- ==========================
      CREATE TABLE IF NOT EXISTS mensagens_interesse (
        id SERIAL PRIMARY KEY,
        veiculo_id INT REFERENCES veiculos(id) ON DELETE CASCADE,
        nome VARCHAR(100) NOT NULL,
        telefone VARCHAR(30),
        email VARCHAR(100),
        mensagem TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Todas as tabelas foram criadas (ou já existiam).");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  } finally {
    pool.end();
  }
};

criarTabelas();
