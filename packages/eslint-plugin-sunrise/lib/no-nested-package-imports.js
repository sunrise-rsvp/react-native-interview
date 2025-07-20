"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noNestedPackageImportsRule = void 0;
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`);
exports.noNestedPackageImportsRule = createRule({
    create(context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const packageNames = ['primitives', 'composites', 'api-client'];
                for (const packageName of packageNames) {
                    const match = importPath.match(`^(@sunrise-ui/${packageName})/[^'"]+`);
                    if (match) {
                        context.report({
                            node,
                            messageId: 'replaceImport',
                            data: { packageName },
                            fix(fixer) {
                                // Replace the long import path with just @sunrise-ui/${packageName}
                                const fixedImport = `'@sunrise-ui/${packageName}'`;
                                return fixer.replaceText(node.source, fixedImport);
                            },
                        });
                    }
                }
            },
        };
    },
    meta: {
        type: 'problem',
        fixable: 'code',
        docs: {
            description: 'Disallow nested import paths from packages',
        },
        schema: [],
        messages: {
            replaceImport: 'Use {{ packageName }} import instead',
        },
    },
    name: 'no-nested-package-imports',
    defaultOptions: [],
});
