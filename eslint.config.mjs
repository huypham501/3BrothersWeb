import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', '.chrome-profile/**'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    files: [
      'src/lib/cms/resolvers/**/*.ts',
      'src/lib/cms/queries/**/*.ts',
      'src/lib/cms/types/**/*.ts',
    ],
    languageOptions: {
      parser: tsEslintParser,
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
];

export default config;
