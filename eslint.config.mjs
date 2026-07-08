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
  {
    rules: {
      // Static values belong in Tailwind classes/tokens, not `style={{}}`.
      // Only flags hardcoded literals (strings/numbers); template literals,
      // call expressions, and identifiers (i.e. genuinely runtime-computed
      // values) are left alone — see docs/10-design-system.md.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'JSXAttribute[name.name="style"] ObjectExpression > Property[value.type="Literal"]',
          message:
            "Static values in style={{}} belong in a Tailwind class instead. Inline style is reserved for values computed at render time.",
        },
      ],
    },
  },
  prettier,
];

export default eslintConfig;
