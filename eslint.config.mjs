import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint, { } from 'typescript-eslint';

//import js from '@eslint/js';
//import { defineConfig } from "eslint/config";
//
//export default defineConfig([
//  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
//  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.node } },
//  tseslint.configs.recommended,
//]);

export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{mjs,js,ts}'], ignores: ['./gen/*.{js/ts}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error', { caughtErrors: 'all', caughtErrorsIgnorePattern: '^ignore', ignoreRestSiblings: true }
            ],
            'eol-last': 'error',
            indent: ['error', 4, { SwitchCase: 1 }],
            //'max-len': [ 'error', 120 ],
            //'max-lines-per-function': [ 'error', 30 ],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            semi: ['error', 'always'],
            'sort-imports': ['error', {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: true,
                memberSyntaxSortOrder: ['single', 'all', 'multiple', 'none'],
                allowSeparatedGroups: false
            }]
        }
    }
];
