---
name: nova-action
description: Criar uma nova Server Action em src/app/actions/ seguindo o template obrigatório do projeto (autorização → validação → try/catch → retorno boolean ou Result). Use quando o usuário pedir uma nova mutação no Firestore/Storage (criar, editar, deletar dados). Não usar para leituras — essas vão em src/app/server/.
---

# Nova Server Action

Esta skill guia a criação de uma nova Server Action respeitando as convenções obrigatórias documentadas em `src/app/actions/CLAUDE.md`.

## Passos

1. **Confirmar com o usuário** (em uma frase) o nome da action e o que ela deve fazer
2. **Ler `src/app/actions/CLAUDE.md`** para reconfirmar o template atual (pode ter sido atualizado)
3. **Examinar uma action existente similar** em `src/app/actions/` — por exemplo:
   - Mutação simples sem upload: `create-link.ts`, `update-profile.ts` (parcial)
   - Mutação com upload de imagem: `create-project.ts`, `update-profile.ts`
   - Incremento atômico: `increase-profile-visits.ts`
4. **Criar o arquivo** em `src/app/actions/nome-em-kebab.ts` com a estrutura:

```typescript
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export type MinhaActionInput = {
  // ...
}

export type MinhaActionResult = { ok: true } | { ok: false; error: string }

export async function minhaAction(input: MinhaActionInput): Promise<MinhaActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Não autorizado' }

  // validação dos inputs

  try {
    // operações Firestore
    return { ok: true }
  } catch (error) {
    console.error('Erro em minhaAction:', error)
    return { ok: false, error: 'Erro ao processar a operação' }
  }
}
```

5. **Decidir o tipo de retorno**:
   - `boolean` → mutações simples onde só importa sucesso/falha (ex: `verify-link`, `increase-*`)
   - `{ ok, error? }` → quando o caller precisa exibir uma mensagem específica de erro ao usuário
6. **Checar ownership** quando a action modifica recurso existente: ler o documento, comparar `data.userId === session.user.id`, retornar erro se não bater
7. **Timestamps**: `Timestamp.now().toMillis()` (importado de `firebase-admin/firestore`)
8. **IDs gerados**: `randomUUID()` de `node:crypto`
9. **Uploads**: a action recebe `FormData` (não objetos cruos), faz `storage.file(path).save(buffer)` e guarda o `imagePath` (não a URL) no Firestore
10. **Rodar `/verificar`** após criar o arquivo

## Checklist antes de declarar pronto

- [ ] Arquivo começa com `'use server'`
- [ ] `auth()` checada antes de qualquer operação
- [ ] Tipos `Input` e/ou `Result` exportados se a action recebe argumentos não-triviais
- [ ] `try/catch` com `console.error` descritivo
- [ ] Mensagens de erro retornadas ao client são **genéricas em pt-BR** (não vazam stack)
- [ ] Se modifica recurso existente: ownership verificado
- [ ] Action é importada e usada por algum componente client (server actions órfãs viram dead code)
