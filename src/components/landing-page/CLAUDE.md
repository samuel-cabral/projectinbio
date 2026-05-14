# CLAUDE.md — Landing Page Components

Componentes de marketing da landing page (`src/app/(pages)/page.tsx`). Reutilizam componentes de `common/` em modo preview.

## Componentes

- `header.tsx` — **Server Component** (chama `auth()` e busca `profileId` do usuário logado). Botão "Minha Página" só aparece para autenticados
- `hero.tsx` — Seção principal com headline + `UserCard preview` + `ProjectCard` mockados
- `hero-link-input.tsx` — Input de criação de link com fluxo OAuth-gate (salva link em `localStorage` antes do login)
- `pricing.tsx` — Cards de preço (consome `MONTHLY_PRICE` / `ANNUAL_PRICE_WITH_DISCOUNT` de `@/lib/config`)
- `faq.tsx` + `faq-item.tsx` — Accordion de perguntas frequentes
- `video-explanation.tsx` — Embed de vídeo demo

## Convenções

- Componentes de preview consomem `MOCK_PROFILE` e `MOCK_PROJECTS` de `@/lib/mocks/profile`
- Componentes que renderizam variante "preview" do `UserCard`/`ProjectCard` passam `preview` prop — esses componentes substituem `<Link>` por `<span>` para evitar navegação
- Textos em **português (pt-BR)** — esta é uma landing page voltada ao mercado brasileiro
- `header.tsx` é o único Server Component aqui; demais são apresentação estática (sem hooks/estado, podem ser server, mas hoje todos são tratados como apresentacionais)
- Preços formatados via `formatPriceToBRL()` de `@/lib/config` — nunca hardcodar `R$ X,XX` no JSX
