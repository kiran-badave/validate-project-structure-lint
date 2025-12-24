export type NamingConvention = 'PascalCase' | 'camelCase' | 'kebab-case' | 'snake_case' | 'UPPER_CASE';

export type Severity = 'error' | 'warning';

export interface FilePattern {
  pattern: string;
  required?: boolean;
  description?: string;
}

export interface FolderRule {
  name: string;
  path: string;
  requiredFiles?: FilePattern[];
  namingConvention?: NamingConvention;
  allowedExtensions?: string[];
  maxDepth?: number;
}

export interface ProjectConfig {
  preset?: string;
  rootDir?: string;
  rules?: {
    folderStructure?: FolderRule[];
    componentColocation?: {
      enabled: boolean;
      componentDirs: string[];
      requiredFiles: FilePattern[];
      namingConvention?: NamingConvention;
    };
    fileNaming?: {
      [pattern: string]: {
        convention: NamingConvention;
        severity?: Severity;
      };
    };
  };
  ignore?: string[];
  severity?: Severity;
}

export interface ValidationError {
  type: 'missing-file' | 'naming-violation' | 'structure-violation' | 'forbidden-file';
  severity: Severity;
  message: string;
  file?: string;
  directory?: string;
  expected?: string;
  actual?: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  filesScanned: number;
  directoriesScanned: number;
}

export interface Preset {
  name: string;
  description: string;
  config: ProjectConfig;
}

// Made with 
