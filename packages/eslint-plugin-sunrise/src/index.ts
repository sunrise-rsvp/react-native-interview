import { noMissingDependencies } from './no-missing-dependencies';
import { noNestedPackageImportsRule } from './no-nested-package-imports';

const plugin = {
  meta: { name: 'eslint-plugin-sunrise', version: '1.0.0' },
  rules: {
    'no-nested-package-imports': noNestedPackageImportsRule,
    'no-missing-dependencies': noMissingDependencies,
  },
};

export = plugin;
