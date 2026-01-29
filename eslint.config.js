import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  // Base
  eslint.configs.recommended,
  tseslint.configs.strict,

  // React
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],

  // Désactive les règles incompatibles avec Prettier
  prettierConfig,

  {
    ignores: ['node_modules', 'dist', 'build', '.vite', 'coverage'],
    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // Fait de Prettier une règle ESLint
      'prettier/prettier': 'error',
    },

    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
