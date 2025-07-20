import { readFileSync } from 'fs';
import { resolve } from 'path';

export const workspaceRoot = resolve(__dirname, '../../..');
export const projectDependencies = new Map<string, Set<string>>();

export function getRootDevDependencies() {
  if (!projectDependencies.has(workspaceRoot)) {
    const file = readFileSync(`${workspaceRoot}/package.json`, 'utf-8');
    const pkg = JSON.parse(file);
    projectDependencies.set(
      workspaceRoot,
      new Set(Object.keys(pkg.devDependencies)),
    );
  }

  return projectDependencies.get(workspaceRoot) as Set<string>;
}

export function getModuleDependencies(modulePath: string) {
  const jsonPackagePath = `${modulePath}/package.json`;
  if (!projectDependencies.has(jsonPackagePath)) {
    const file = readFileSync(jsonPackagePath, 'utf-8');
    const pkg = JSON.parse(file);
    const allDependencies = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
    };
    projectDependencies.set(
      jsonPackagePath,
      new Set(Object.keys(allDependencies)),
    );
  }

  return projectDependencies.get(jsonPackagePath) as Set<string>;
}

export function getRelativeModulePathFromFilePath(path: string) {
  const matches = [...path.matchAll(/(apps\/|packages\/)([^/]+)[^/]/g)];
  return matches[0]?.[0];
}
