# CLAUDE.md — UserCard e seus Editors

Componentes do card de perfil do usuário. Cada arquivo é um componente client distinto.

## Arquivos

- `user-card.tsx` — Componente principal. Recebe `profileData`, `avatarUrl`, `isOwner`, `preview`. Mantém estado **otimista** local para campos editáveis (displayName, description, avatarUrl) via `useState` — atualizado pelo callback `onProfileUpdated` dos dialogs
- `edit-profile.tsx` — Dialog para editar nome, descrição e avatar. Chama `updateProfile` action. Comprime avatar com `compressImageForAvatar()` antes do upload
- `edit-social-links.tsx` — Dialog para editar URLs do GitHub/LinkedIn/Instagram/Twitter. Chama `createSocialLinks` action
- `add-custom-link.tsx` — Dialog para adicionar/editar links customizados. Chama `createCustomLink` action

## Padrão de update otimista

1. `UserCard` mantém estados locais (`localDisplayName`, `localDescription`, `localAvatarUrl`)
2. Dialog filho recebe callback `onProfileUpdated`
3. Após sucesso da server action, dialog chama callback → estado local atualiza imediatamente
4. `router.refresh()` em paralelo dispara revalidação server-side
5. `onClearOptimistic` é chamado quando o refresh termina, liberando o valor do server

Use esse padrão para qualquer novo dialog de edição inline.

## Convenções

- Todos `'use client'` (usam estado, dialogs, file inputs)
- Componentes recebem `isOwner` e renderizam o trigger condicionalmente
- Imagens previewadas via `URL.createObjectURL()` antes do upload
- Forms usam `FormData` (compatível com server actions que aceitam upload)
- Mensagens de erro/sucesso em **português**
