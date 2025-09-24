import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'quotes': ['error', 'single', { 
        avoidEscape: true,
        allowTemplateLiterals: true 
      }],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'no-multiple-empty-lines': ['error', { 
        max: 2,
        maxEOF: 1 
      }]
    }
  },
  {
    files: ['**/*.test.js'],
    rules: {
      'no-console': 'off'
    }
  }
]; 