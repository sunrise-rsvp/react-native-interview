import { ESLintUtils } from '@typescript-eslint/utils';
import {
  getModuleDependencies,
  getRelativeModulePathFromFilePath,
  workspaceRoot,
} from './utils';

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const noMissingDependencies = createRule({
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (
          importPath.startsWith('.') ||
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
        if (!importPath.startsWith('@')) baseImport = pieces[0];
        else baseImport = `${pieces[0]}/${pieces[1]}`;

        const rootDependencies = getModuleDependencies(workspaceRoot);
        const rootHasDependency = rootDependencies.has(baseImport);

        let moduleHasDependency = true;
        const relativeModulePath = getRelativeModulePathFromFilePath(
          context.filename,
        );
        if (relativeModulePath) {
          const moduleDependencies = getModuleDependencies(
            `${workspaceRoot}/${relativeModulePath}`,
          );
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
      description:
        "Finds dependencies that are used but not declared in a module's package.json",
    },
    schema: [],
    messages: {
      declareDependency:
        'Declare {{ dependency }} in {{ module }} package.json',
    },
  },
  name: 'no-missing-dependencies',
  defaultOptions: [],
});
