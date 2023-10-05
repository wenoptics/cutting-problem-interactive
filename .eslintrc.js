module.exports = {
  extends: [
    // 'semistandard',
    // 'standard',
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  ignorePatterns: ["src/env.d.ts", "**/vendor/*.js"],
  rules: {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/ban-ts-comment": "warn",
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "vue/no-deprecated-slot-attribute": "warn",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 5,
        },
        multiline: {
          max: 3,
        },
      },
    ],
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    // 'vue'
  ],
};
