// eslint.config.mjs
export default [
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        extends: [
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:react-hooks/recommended",
            "plugin:import/errors",
            "plugin:import/warnings",
            "plugin:import/typescript",
            "plugin:prettier/recommended"
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        plugins: ["react", "@typescript-eslint", "prettier"],
        rules: {
            "prettier/prettier": "error",
            "react/react-in-jsx-scope": "off", // React 17+ 에서는 필요 없음
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
];
