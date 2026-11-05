import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { initDb, clearDb, closeDb, pool } from '../../src/db.js';

describe('Integration Test: API Users contra Banco PostgreSQL Real', () => {
  beforeAll(async () => {
    // Garante que a tabela exista antes de iniciar a suíte
    await initDb();
  });

  beforeEach(async () => {
    // Isola o estado limpando os dados entre os testes
    await clearDb();
  });

  afterAll(async () => {
    // Fecha o pool de conexões para não travar o processo
    await closeDb();
  });

  it('deve inserir um usuário na API e persistir com sucesso no PostgreSQL', async () => {
    const payload = {
      name: 'Maria Engenheira',
      email: 'maria.ci@example.com'
    };

    // 1. Chamada via HTTP na API
    const response = await request(app)
      .post('/users')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(payload.name);
    expect(response.body.email).toBe(payload.email);

    // 2. Verificação direta no banco de dados real
    const dbResult = await pool.query('SELECT * FROM users WHERE email = $1;', [payload.email]);
    expect(dbResult.rows).toHaveLength(1);
    expect(dbResult.rows[0].name).toBe(payload.name);
  });

  it('deve listar usuários cadastrados no banco de dados', async () => {
    // Insere diretamente no banco para preparar o cenário
    await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2), ($3, $4);',
      ['User 1', 'u1@example.com', 'User 2', 'u2@example.com']
    );

    // Consulta via endpoint da API
    const response = await request(app)
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].email).toBe('u1@example.com');
    expect(response.body[1].email).toBe('u2@example.com');
  });
});
