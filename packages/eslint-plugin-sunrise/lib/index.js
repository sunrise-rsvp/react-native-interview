"use strict";
const no_missing_dependencies_1 = require("./no-missing-dependencies");
const no_nested_package_imports_1 = require("./no-nested-package-imports");
const plugin = {
    meta: { name: 'eslint-plugin-sunrise', version: '1.0.0' },
    rules: {
        'no-nested-package-imports': no_nested_package_imports_1.noNestedPackageImportsRule,
        'no-missing-dependencies': no_missing_dependencies_1.noMissingDependencies,
    },
};
module.exports = plugin;
