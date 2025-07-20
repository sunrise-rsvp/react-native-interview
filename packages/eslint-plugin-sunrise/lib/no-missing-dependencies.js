"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noMissingDependencies = void 0;
const utils_1 = require("@typescript-eslint/utils");
const utils_2 = require("./utils");
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`);
exports.noMissingDependencies = createRule({
    create(context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                if (importPath.startsWith('.') ||
                    importPath.startsWith('@sunrise-ui') ||
                    importPath.startsWith('@app') ||
                    importPath.startsWith('@assets') ||
                    importPath.startsWith('@constants') ||
                    importPath.startsWith('@hooks') ||
                    importPath.startsWith('@contexts') ||
                    importPath.startsWith('@queries') ||
                    importPath.startsWith('@utils') ||
                    importPath.startsWith('@atoms') ||
                    importPath.startsWith('@molecules') ||
                    importPath.startsWith('@organisms') ||
                    importPath.startsWith('@templates') ||
                    importPath.startsWith('@hoc') ||
                    importPath === 'fs' || // Inbuilt node module
                    importPath === 'path' || // Inbuilt node module
                    importPath.startsWith('expo-modules-core') // This dependency comes with other expo ones
                ) {
                    return;
                }
                const pieces = importPath.split('/');
                let baseImport;
                if (!importPath.startsWith('@'))
                    baseImport = pieces[0];
                else
                    baseImport = `${pieces[0]}/${pieces[1]}`;
                const rootDependencies = (0, utils_2.getModuleDependencies)(utils_2.workspaceRoot);
                const rootHasDependency = rootDependencies.has(baseImport);
                let moduleHasDependency = true;
                const relativeModulePath = (0, utils_2.getRelativeModulePathFromFilePath)(context.filename);
                if (relativeModulePath) {
                    const moduleDependencies = (0, utils_2.getModuleDependencies)(`${utils_2.workspaceRoot}/${relativeModulePath}`);
                    moduleHasDependency = moduleDependencies.has(baseImport);
                }
                if (!rootHasDependency || !moduleHasDependency) {
                    context.report({
                        node,
                        messageId: 'declareDependency',
                        data: {
                            dependency: baseImport,
                            module: rootHasDependency
                                ? relativeModulePath.split('/')[1]
                                : 'root',
                        },
                    });
                }
            },
        };
    },
    meta: {
        type: 'problem',
        docs: {
            description: "Finds dependencies that are used but not declared in a module's package.json",
        },
        schema: [],
        messages: {
            declareDependency: 'Declare {{ dependency }} in {{ module }} package.json',
        },
    },
    name: 'no-missing-dependencies',
    defaultOptions: [],
});
