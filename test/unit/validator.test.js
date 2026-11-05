import { describe, it, expect } from 'vitest';
import { validateUser } from '../../src/validator.js';

describe('Unit Test: validateUser', () => {
  it('deve validar com sucesso um usuário com nome e e-mail válidos', () => {
    const user = { name: 'Dev FullCycle', email: 'dev@fullcycle.com.br' };
    const result = validateUser(user);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('deve rejeitar usuário quando o nome tiver menos de 3 caracteres', () => {
    const user = { name: 'Al', email: 'al@example.com' };
    const result = validateUser(user);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('O nome deve ter pelo menos 3 caracteres.');
  });

  it('deve rejeitar usuário quando o e-mail for inválido', () => {
    const user = { name: 'Carlos Silva', email: 'email-sem-arroba' };
    const result = validateUser(user);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('E-mail com formato inválido.');
  });

  it('deve rejeitar objeto nulo ou indefinido', () => {
    const result = validateUser(null);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Dados de usuário inválidos');
  });
});
