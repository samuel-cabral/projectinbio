# CLAUDE.md — Components

Este diretório contém todos os componentes React, divididos em três subdiretórios.

## ui/ — Componentes primitivos

- Baseados em `@base-ui-components/react` (Button, Dialog)
- Variantes definidas com `class-variance-authority` (`cva`)
- Estilização com `cn()` de `@/lib/utils` (clsx + tailwind-merge)
- Atributo `data-slot` para identificação semântica dos elementos
- Componentes exportados individualmente (ex: `DialogContent`, `DialogTrigger`)

## common/ — Componentes de negócio

- Componentes reutilizáveis ligados a features do app (UserCard, ProjectCard, TotalVisits)
- Dialogs gerenciam estado próprio (`useState` para open/close e form values)
- Componentes de edição recebem prop `isOwner` e só renderizam se `true`
- Após mutação via server action: `router.refresh()` dentro de `startTransition()`
- Preview de imagens usa `URL.createObjectURL()` antes do upload

## landing-page/ — Componentes de marketing

- Usam dados mock de `@/lib/mocks/` para demonstração
- `header.tsx` é Server Component (verifica `auth()`)
- Demais são componentes de apresentação estática

## Convenções gerais

- `'use client'` apenas quando o componente usa hooks, estado ou event handlers
- Ícones exclusivamente de `lucide-react`
- Imports Next.js: `next/image` para imagens, `next/link` para navegação, `next/navigation` para hooks de rota
- Nomes de arquivo em kebab-case, componentes em PascalCase
- Agrupar componentes relacionados em subdiretórios (ex: `user-card/`)
