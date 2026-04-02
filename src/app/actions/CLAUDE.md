# CLAUDE.md — Server Actions

Este diretório contém todas as Server Actions (mutações) do app.

## Estrutura obrigatória

```typescript
'use server'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

export async function nomeAction(...args) {
  // 1. Autorização
  const session = await auth()
  if (!session?.user?.id) return false

  // 2. Validação dos inputs

  // 3. Lógica de negócio (try/catch)
  try {
    // Firestore operations
    return true // ou { ok: true, data }
  } catch (error) {
    console.error('Descrição do erro:', error)
    return false // ou { ok: false, error: 'mensagem genérica' }
  }
}
```

## Convenções

- Sempre começar o arquivo com `'use server'`
- Sempre verificar `session?.user?.id` antes de qualquer operação
- Retornos simples: `boolean`. Retornos complexos: `{ ok: boolean, error?: string }`
- Nunca expor stack traces ou detalhes internos ao client
- Tipos de input/output exportados usam sufixo `Input` ou `Result` (ex: `CreateSocialLinksInput`, `UpdateProfileResult`)
- Timestamps: usar `Timestamp.now().toMillis()` do `firebase-admin/firestore`
- IDs gerados: usar `randomUUID()` de `node:crypto`
- Uploads de imagem: receber `FormData`, salvar no `storage`, guardar o `imagePath` no Firestore
- Funções de leitura devem ficar em `@/app/server/`, não aqui
