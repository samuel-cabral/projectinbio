# CLAUDE.md — Server Data Fetching

Este diretório contém funções read-only de busca de dados no Firestore.

## Estrutura obrigatória

```typescript
import 'server-only'

import { db } from '@/lib/firebase'

export type EntityData = {
  // shape dos dados retornados
}

export async function getEntityData(id: string): Promise<EntityData | null> {
  const doc = await db.collection('collection').doc(id).get()
  if (!doc.exists) return null

  const data = doc.data()
  return {
    // mapear campos com defaults para opcionais
    field: data?.field ?? defaultValue,
  }
}
```

## Convenções

- Sempre usar `import 'server-only'` no topo — impede importação acidental no client
- Funções são somente leitura — mutações ficam em `@/app/actions/`
- Sem verificação de autorização — os dados de perfil são públicos
- Exportar tipos TypeScript (`ProfileData`, `ProjectData`) que são reutilizados em components e actions
- Campos opcionais devem ter valores default (objetos vazios `{}`, arrays vazios `[]`, strings vazias)
- Nomes de função seguem padrão `get[Entity]Data` ou `get[Entity][Collection]`
