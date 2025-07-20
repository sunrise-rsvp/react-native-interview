"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativeModulePathFromFilePath = exports.getModuleDependencies = exports.getRootDevDependencies = exports.projectDependencies = exports.workspaceRoot = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
exports.workspaceRoot = (0, path_1.resolve)(__dirname, '../../..');
exports.projectDependencies = new Map();
function getRootDevDependencies() {
    if (!exports.projectDependencies.has(exports.workspaceRoot)) {
        const file = (0, fs_1.readFileSync)(`${exports.workspaceRoot}/package.json`, 'utf-8');
        const pkg = JSON.parse(file);
        exports.projectDependencies.set(exports.workspaceRoot, new Set(Object.keys(pkg.devDependencies)));
    }
    return exports.projectDependencies.get(exports.workspaceRoot);
}
exports.getRootDevDependencies = getRootDevDependencies;
function getModuleDependencies(modulePath) {
    const jsonPackagePath = `${modulePath}/package.json`;
    if (!exports.projectDependencies.has(jsonPackagePath)) {
        const file = (0, fs_1.readFileSync)(jsonPackagePath, 'utf-8');
        const pkg = JSON.parse(file);
        const allDependencies = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {}),
            ...(pkg.peerDependencies || {}),
        };
        exports.projectDependencies.set(jsonPackagePath, new Set(Object.keys(allDependencies)));
    }
    return exports.projectDependencies.get(jsonPackagePath);
}
exports.getModuleDependencies = getModuleDependencies;
function getRelativeModulePathFromFilePath(path) {
    const matches = [...path.matchAll(/(apps\/|packages\/)([^/]+)[^/]/g)];
    return matches[0]?.[0];
}
exports.getRelativeModulePathFromFilePath = getRelativeModulePathFromFilePath;
