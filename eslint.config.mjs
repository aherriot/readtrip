import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "drizzle/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...next,
  prettier,
];

export default eslintConfig;
