import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    js.configs.recommended,
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
        languageOptions: { globals: globals.browser },
    },
]);
