import pkg from 'pg';
const { Pool } = pkg;

// Configuração obtida estritamente de variáveis de ambiente
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ci_test_db';

export const pool = new Pool({
  connectionString,
  // Se estiver em ambiente CI ou local, timeout curto para falhar rápido
  connectionTimeoutMillis: 5000,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function clearDb() {
  await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
}

export async function closeDb() {
  await pool.end();
}
