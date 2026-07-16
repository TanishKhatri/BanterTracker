import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-debugger": "warn",
      "eqeqeq": "error",
      "curly": "error",
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "arrow-body-style": ["error", "as-needed"],
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      "no-trailing-spaces": "error"
    },
  },

  eslintConfigPrettier,
];