/**
 * Validador de dados de usuário - Regra de negócio pura (Ideal para Testes Unitários)
 */
export function validateUser(user) {
  const errors = [];

  if (!user || typeof user !== "object") {
    return { isValid: false, errors: ["Dados de usuário inválidos"] };
  }

  // BUG INTENCIONAL PARA O EXPERIMENTO 2:
  // Alguém alterou a regra exigindo 50 caracteres para o nome, quebrando o sistema
  if (!user.name || typeof user.name !== "string" || user.name.trim().length < 50) {
    errors.push("O nome deve ter pelo menos 3 caracteres.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || typeof user.email !== "string" || !emailRegex.test(user.email)) {
    errors.push("E-mail com formato inválido.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza dados de entrada garantindo campos em formato padrão
 */
export function sanitizeUser(user) {
  if (!user || typeof user !== "object") return null;
  return {
    name: typeof user.name === "string" ? user.name.trim() : "",
    email: typeof user.email === "string" ? user.email.trim().toLowerCase() : ""
  };
}
