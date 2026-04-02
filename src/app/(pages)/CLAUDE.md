# CLAUDE.md — Pages & Routes

Este diretório contém as páginas e rotas do App Router.

## Estrutura de rotas

- `page.tsx` — Landing page (pública)
- `criar/` — Página de criação de perfil (protegida por middleware)
- `[profileId]/` — Página de perfil dinâmica (protegida por middleware)
- `[profileId]/upgrade/` — Página de upgrade/pricing

## Convenções

- **Pages são Server Components por padrão** — funções `async` que buscam dados diretamente
- Buscar dados com funções de `@/app/server/` e sessão com `auth()` de `@/lib/auth`
- Executar mutações via server actions de `@/app/actions/`
- Usar `'use client'` apenas em componentes interativos (forms, dialogs, botões com estado)
- Componentes client dentro de pages usam `useRouter().refresh()` + `startTransition()` para atualização otimista após mutações
- Uploads de arquivo via `FormData`
- Todos os textos de UI devem ser em **português (pt-BR)**
- Parâmetros dinâmicos: `useParams()` no client, `params` prop no server
- Componentes client de formulário ficam co-localizados com sua page (ex: `criar/create-link-form.tsx`)
