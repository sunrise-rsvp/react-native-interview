export declare const workspaceRoot: string;
export declare const projectDependencies: Map<string, Set<string>>;
export declare function getRootDevDependencies(): Set<string>;
export declare function getModuleDependencies(modulePath: string): Set<string>;
export declare function getRelativeModulePathFromFilePath(path: string): string;
