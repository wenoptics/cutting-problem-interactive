module.exports = {
  extends: [
    // 'semistandard',
    // 'standard',
    'plugin:vue/vue3-recommended'
    // 'plugin:@typescript-eslint/recommended',
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  rules: {
    'vue/no-unused-vars': 'warn',
    'vue/no-deprecated-slot-attribute': 'warn',
    "vue/max-attributes-per-line": [
      "error",
      {
        "singleline": {
          "max": 5
        },
        "multiline": {
          "max": 3
        }
      }
    ],
  }
  // plugins: [
  //   '@typescript-eslint'
  // ]
}
