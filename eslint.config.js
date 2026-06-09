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
        languageOptions: { globals: globals.browser },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off', // ← lets unused-imports handle it with auto-fix
            'no-unused-vars': 'off', // ← also turn off base rule
            'unused-imports/no-unused-vars': 'off', // ← turn off its var rule too
            'unused-imports/no-unused-imports': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
]);
