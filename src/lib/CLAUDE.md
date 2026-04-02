# CLAUDE.md — Lib (Utilitários e Configuração)

Este diretório contém utilitários, configuração de serviços externos e constantes do app.

## Módulos

### firebase.ts
- Inicialização do Firebase Admin SDK (Firestore + Cloud Storage)
- Marcado com `import 'server-only'` — **nunca importar em componentes client**
- Exporta: `db` (Firestore), `storage` (Cloud Storage bucket), `getDownloadUrlFromPath()`
- Credencial Firebase decodificada de `FIREBASE_PRIVATE_KEY_BASE64` (base64)
- URLs assinadas para imagens geradas via `getDownloadUrlFromPath()`

### auth.ts / auth.config.ts
- NextAuth v5 (beta) com Google OAuth provider
- Adapter: `@auth/firebase-adapter` (sessões no Firestore)
- Estratégia de sessão: JWT
- Callbacks adicionam `user.id` ao token e session
- Exporta: `handlers`, `auth`, `signIn`, `signOut`

### utils.ts
- `cn()` — merge de classes Tailwind (clsx + tailwind-merge)
- `sanitizeLink()` — normaliza texto para URL-safe slug (remove acentos, caracteres especiais, lowercase)
- `compressImage()` / `compressImageForAvatar()` — compressão client-side com `browser-image-compression` (max 0.2MB). **Apenas para uso em componentes client**

### config.ts
- Constantes de pricing em BRL: `TRIAL_DAYS`, `MONTHLY_PRICE`, `ANNUAL_PRICE_WITH_DISCOUNT`
- Helpers: `calculateDiscountPercentage()`, `formatPriceToBRL()`

### mocks/
- Dados mock (`MOCK_PROFILE`, `MOCK_PROJECTS`) para preview na landing page
- Seguem os tipos `ProfileData` e `ProjectData` definidos em `@/app/server/`

## Convenção importante

Ao adicionar novos módulos aqui, definir claramente se são server-only ou client-compatible. Módulos que usam Firebase Admin, variáveis de ambiente secretas ou Node.js APIs devem ter `import 'server-only'`.
