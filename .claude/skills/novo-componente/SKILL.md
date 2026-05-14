---
name: novo-componente
description: Criar um novo componente React (server ou client) seguindo as convenções do projeto — nomeclatura kebab-case, 'use client' apenas se interativo, ícones de lucide-react, cn() para classes. Use quando o usuário pedir um novo componente em src/components/ ou um componente co-localizado a uma page.
---

# Novo Componente

Esta skill orienta a criação de um novo componente React.

## 1. Decidir onde colocar

- `src/components/ui/` — primitivo reutilizável baseado em `@base-ui/react` (Button, Dialog, Input, Textarea). Use `cva` para variantes
- `src/components/common/` — componente de feature reutilizável (UserCard, ProjectCard, TotalVisits)
- `src/components/landing-page/` — seção da landing page
- Co-localizado com uma page (ex: `src/app/(pages)/criar/create-link-form.tsx`) — quando o componente só faz sentido naquela rota

Se houver dúvida, perguntar ao usuário em uma frase.

## 2. Decidir server vs. client

**Server Component (default)** — preferir sempre que possível. Permite:
- `await` direto no corpo
- Chamar `auth()`, funções de `@/app/server/`, `getDownloadUrlFromPath()`
- Importar `@/lib/firebase` (que é `server-only`)

**Client Component (`'use client'`)** — só quando há:
- Hooks (`useState`, `useEffect`, `useRouter`, `useParams`, `useSearchParams`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`URL.createObjectURL`, `localStorage`)
- Componentes filhos client que aceitam children client-only

> **Padrão recomendado**: extrair só a parte interativa como subcomponente client e manter o pai como Server Component. Veja a memory `feedback_client_components.md`.

## 3. Esqueleto

```typescript
// kebab-case-do-arquivo.tsx
import { IconeName } from 'lucide-react'

import { cn } from '@/lib/utils'

type MeuComponenteProps = {
  // props tipadas
  className?: string
}

export function MeuComponente({ className }: MeuComponenteProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {/* ... */}
    </div>
  )
}
```

Para client component:

```typescript
'use client'

import { useState } from 'react'
// ...
```

## 4. Regras gerais

- Nome do arquivo: `kebab-case.tsx`
- Nome do componente: `PascalCase`
- Ícones: **exclusivamente** de `lucide-react`
- Imagens: `next/image` (não `<img>`, exceto quando há motivo claro — ver `project-card.tsx` que usa `<img>` por simplicidade com signed URLs)
- Links internos: `next/link`
- Classes: sempre via `cn()` quando houver mais de uma fonte de classes ou condicionais
- Textos: **português (pt-BR)**
- Importações: o `simple-import-sort` reordena automaticamente — não brigue com ele

## 5. Depois de criar

- Importar e usar o componente em pelo menos um lugar (sem isso vira dead code)
- Rodar `/verificar` (lint + type-check + format:check)
