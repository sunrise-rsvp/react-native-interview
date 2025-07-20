declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    rules: {
        'no-nested-package-imports': import("@typescript-eslint/utils/dist/ts-eslint").RuleModule<"replaceImport", never[], unknown, import("@typescript-eslint/utils/dist/ts-eslint").RuleListener>;
        'no-missing-dependencies': import("@typescript-eslint/utils/dist/ts-eslint").RuleModule<"declareDependency", never[], unknown, import("@typescript-eslint/utils/dist/ts-eslint").RuleListener>;
    };
};
export = plugin;
