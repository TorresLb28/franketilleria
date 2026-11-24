import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    rules: {
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-shadow': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { args: 'none' }]
    }
  },
  {
    files: ['src/scenes/**/*.js', 'src/main.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    // core must stay pure: no browser globals, no Phaser, no scenes
    files: ['src/core/**/*.js'],
    rules: {
      'no-param-reassign': ['error', { props: true }],
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['phaser', '**/scenes/*'],
          message: 'src/core must not depend on Phaser or scenes.'
        }]
      }]
    }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node }
  },
  {
    // CLI scripts print their report on purpose
    files: ['scripts/**/*.js'],
    rules: { 'no-console': 'off' }
  }
];
