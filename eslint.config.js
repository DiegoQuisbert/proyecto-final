import eslint from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    eslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.js', '**/*.vue'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
];
