# Artefato: Pipeline que Protege a Main

## 📋 Visão Geral

Exercício prático de CI/CD focado em criar um pipeline de integração contínua que protege o branch principal (`main`) de um repositório, garantindo que apenas código testado e validado seja integrado.

---

## 🎯 Objetivo

Criar um repositório com uma API pequena (Node.js ou Python) protegida por um workflow de CI que valida cada alteração antes da fusão na `main`.

---

## 🧱 Requisitos do Projeto

### Estrutura da Aplicação
- [ ] API pequena implementada em **Node** ou **Python**
- [ ] Pelo menos **um teste unitário**
- [ ] Pelo menos **um teste que consulta um banco de dados real**

### Workflow de CI
- [ ] Arquivo de workflow configurado no repositório
- [ ] Sem credenciais reais no arquivo (usar secrets/variáveis de ambiente)

---

## 🔬 Experimentos de Validação

Executar três experimentos no ambiente local/remoto e observar o comportamento:

| # | Experimento | O que observar |
|---|-------------|----------------|
| 1 | Push de commit com teste **passando** | O pipeline roda completo e o merge é permitido |
| 2 | Push de commit com teste **falhando** | O pipeline falha e bloqueia a proteção da `main` |
| 3 | Alteração que viola a **dependência entre jobs** | O segundo job não inicia antes do primeiro terminar |

---

## ✅ Critérios de Autoavaliação

1. **Legibilidade** — Nomes de jobs e passos descritivos e claros.
2. **Dependência correta** — O segundo job **não pode começar** antes do primeiro terminar quando há dependência declarada (`needs`).
3. **Segurança** — O arquivo do workflow **não deve conter credenciais reais**.

---

## 💡 Exemplo de Esqueleto de Workflow

```yaml
name: Protect Main

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test-unit:
    name: Rodar testes unitários
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Executar testes unitários
        run: npm test -- --unit

  test-integration:
    name: Rodar testes contra banco real
    needs: test-unit          # garante a ordem de execução
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}   # sem credencial hardcoded
    steps:
      - uses: actions/checkout@v4
      - name: Executar testes de integração
        run: npm test -- --integration