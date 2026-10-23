import js from '@eslint/js';
import globals from 'globals';

export default [
 { ignores: ['node_modules/', 'coverage/'] },
 js.configs.recommended,
 {
  languageOptions: {
   ecmaVersion: 'latest',
   sourceType: 'module',
   globals: globals.node,
  },
  rules: {
   'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
   'prefer-const': 'error',
   eqeqeq: ['error', 'always'],
   'no-console': 'off',
  },
 },
];
