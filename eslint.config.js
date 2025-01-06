import path from "node:path";
import { fileURLToPath } from "node:url";

import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

import { includeIgnoreFile } from "@eslint/compat";
import pluginJs from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  pluginJs.configs.recommended,

  ...tseslint.configs.recommended,

  includeIgnoreFile(gitignorePath),

  { ignores: [".eslint.config.js"] },

  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
  },

  {
    plugins: {
      eslintPluginUnicorn,
      eslintPluginImport,
    },
  },

  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      "eslintPluginUnicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
      // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "eslintPluginImport/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          "pathGroups": [
            {
              pattern: "*",
              group: "external",
              position: "before",
            },
            {
              pattern: "config/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "db/**",
              group: "internal",
              position: "after",
            },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "newlines-between": "always",
          "alphabetize": {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // "no-restricted-imports": [
      //   "error",
      //   {
      //     patterns: [
      //       "../*", // запрещает импорты из родительских директорий
      //       "./*", // запрещает импорты из соседних файлов
      //     ],
      //   },
      // ],
    },
  },
];
