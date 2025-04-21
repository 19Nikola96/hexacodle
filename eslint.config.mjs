import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort"],
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "no-console": ["error"],
    },
  }),
];

export default eslintConfig;
