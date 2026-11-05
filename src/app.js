import express from 'express';
import { pool } from './db.js';
import { validateUser } from './validator.js';

export const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/users', async (req, res) => {
  const validation = validateUser(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const { name, email } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at;',
      [name.trim(), email.trim().toLowerCase()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation no PostgreSQL
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('Database error:', error);
    res.status(500).json({ error: 'Erro interno ao salvar no banco.' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC;');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Erro interno ao consultar o banco.' });
  }
});
