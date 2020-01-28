module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    // 'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // 缩进 2
    '@typescript-eslint/indent': ['error', 2],
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'latest'
    }
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    },
    project: "./tsconfig.json"
  }
}