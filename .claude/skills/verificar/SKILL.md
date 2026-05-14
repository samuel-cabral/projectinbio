---
name: verificar
description: Rodar checagens de qualidade do projeto (ESLint, type-check, Prettier) antes de finalizar uma task ou abrir PR. Use sempre que terminar de editar arquivos TS/TSX e quiser confirmar que o código está limpo. Reporta cada falha com o comando que reproduz o erro.
---

# Verificar — checagens de qualidade

Esta skill roda a tríade de verificações que o projeto exige antes de qualquer commit:

1. `pnpm lint` — ESLint (next/core-web-vitals, simple-import-sort, prettier)
2. `pnpm type-check` — `tsc --noEmit`
3. `pnpm format:check` — Prettier (inclui prettier-plugin-tailwindcss)

## Como executar

Rode os três comandos em paralelo (uma única mensagem com 3 Bash tool uses) — eles são independentes:

```bash
pnpm lint
pnpm type-check
pnpm format:check
```

## Como reportar o resultado

- Se todos passarem: uma linha curta — `✓ lint, type-check, format OK`
- Se algum falhar:
  - Listar os arquivos/regras que falharam
  - Mostrar o comando que reproduz: `pnpm lint`, `pnpm type-check`, etc.
  - Sugerir `pnpm lint:fix` para erros de lint auto-corrigíveis
  - Sugerir `pnpm format` para erros de formatação
  - **Não tentar consertar automaticamente** — exibir o erro e deixar o usuário decidir, a menos que ele já tenha pedido para corrigir

## Quando NÃO usar

- Antes de qualquer edição (não há nada para verificar ainda)
- Em alterações puramente em `.md` ou `.env` (lint/type-check não cobrem esses arquivos)
- Quando o usuário está claramente no meio de uma mudança grande (espera ele dizer que terminou)
