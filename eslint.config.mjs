import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('prettier'),
  {
    // Registro explícito do plugin do Next. Necessário para que a detecção do
    // `next build` (que roda `calculateConfigForFile` sobre o próprio arquivo de
    // config) encontre `@next/next` — por isso este arquivo NÃO pode estar nos
    // ignores globais abaixo.
    plugins: {
      '@next/next': nextPlugin,
    },
  },
  {
    // Regras custom + lint type-aware apenas no código-fonte. Arquivos de config
    // (*.config.*) ficam fora daqui para não serem type-parseados (não estão no
    // tsconfig), evitando erro de parser.
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'lf',
        },
      ],
    },
  },
  {
    // `eslint.config.mjs` fica FORA dos ignores de propósito: a detecção do
    // plugin pelo `next build` calcula a config sobre o próprio arquivo de
    // config, e ele usa export nomeado (não dispara import/no-anonymous). Os
    // demais arquivos de config são ignorados (não estão no tsconfig).
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'next.config.ts',
      'postcss.config.mjs',
      'prettier.config.mjs',
    ],
  },
]

export default eslintConfig
