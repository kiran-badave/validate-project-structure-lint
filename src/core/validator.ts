import * as path from 'path';
import micromatch from 'micromatch';
import { ProjectConfig, ValidationError, ValidationResult, FilePattern } from '../types';
import { FileScanner, ScannedFile } from '../utils/fileScanner';
import { validateNamingConvention, getExpectedNaming } from '../utils/naming';

export class ProjectValidator {
  private config: ProjectConfig;
  private scanner: FileScanner;
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];

  constructor(config: ProjectConfig, rootDir: string = process.cwd()) {
    this.config = config;
    const ignorePatterns = config.ignore || [];
    this.scanner = new FileScanner(rootDir, ignorePatterns);
  }

  async validate(): Promise<ValidationResult> {
    this.errors = [];
    this.warnings = [];

    const files = await this.scanner.scanDirectory();
    const filesScanned = files.filter(f => !f.isDirectory).length;
    const directoriesScanned = files.filter(f => f.isDirectory).length;

    // Validate component co-location
    if (this.config.rules?.componentColocation?.enabled) {
      await this.validateComponentColocation();
    }

    // Validate file naming conventions
    if (this.config.rules?.fileNaming) {
      await this.validateFileNaming(files);
    }

    // Validate folder structure
    if (this.config.rules?.folderStructure) {
      await this.validateFolderStructure(files);
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      filesScanned,
      directoriesScanned
    };
  }

  private async validateComponentColocation(): Promise<void> {
    const colocationConfig = this.config.rules?.componentColocation;
    if (!colocationConfig) return;

    const componentDirs = this.scanner.getComponentDirectories(
      colocationConfig.componentDirs
    );

    for (const dir of componentDirs) {
      const contents = await this.scanner.getDirectoryContents(dir);
      const componentName = path.basename(dir);

      // Find the main component file
      const mainFile = contents.find(f => 
        !f.isDirectory && 
        this.isComponentFile(f.name, componentName)
      );

      if (!mainFile) {
        continue; // Skip if no main component file found
      }

      // Check for required files
      for (const filePattern of colocationConfig.requiredFiles) {
        if (!filePattern.required) continue;

        const expectedPattern = this.expandPattern(filePattern.pattern, componentName);
        const matchingFile = contents.find(f => 
          !f.isDirectory && micromatch.isMatch(f.name, expectedPattern)
        );

        if (!matchingFile) {
          const error: ValidationError = {
            type: 'missing-file',
            severity: this.config.severity || 'error',
            message: `Missing required file: ${filePattern.description || expectedPattern}`,
            directory: dir,
            expected: expectedPattern,
            suggestion: `Create ${expectedPattern} in ${dir}/`
          };

          this.addError(error);
        }
      }

      // Validate naming convention for component
      if (colocationConfig.namingConvention) {
        const isValid = validateNamingConvention(
          componentName,
          colocationConfig.namingConvention
        );

        if (!isValid) {
          const expected = getExpectedNaming(
            componentName,
            colocationConfig.namingConvention
          );

          const error: ValidationError = {
            type: 'naming-violation',
            severity: this.config.severity || 'error',
            message: `Component directory name doesn't follow ${colocationConfig.namingConvention} convention`,
            directory: dir,
            actual: componentName,
            expected,
            suggestion: `Rename directory to ${expected}`
          };

          this.addError(error);
        }
      }
    }
  }

  private async validateFileNaming(files: ScannedFile[]): Promise<void> {
    const namingRules = this.config.rules?.fileNaming;
    if (!namingRules) return;

    for (const file of files) {
      if (file.isDirectory) continue;

      // Check each naming rule pattern
      for (const [pattern, rule] of Object.entries(namingRules)) {
        if (micromatch.isMatch(file.path, pattern)) {
          const isValid = validateNamingConvention(file.name, rule.convention);

          if (!isValid) {
            const expected = getExpectedNaming(file.name, rule.convention);

            const error: ValidationError = {
              type: 'naming-violation',
              severity: rule.severity || this.config.severity || 'error',
              message: `File name doesn't follow ${rule.convention} convention`,
              file: file.path,
              actual: file.name,
              expected,
              suggestion: `Rename to ${expected}`
            };

            this.addError(error);
          }
        }
      }
    }
  }

  private async validateFolderStructure(files: ScannedFile[]): Promise<void> {
    const folderRules = this.config.rules?.folderStructure;
    if (!folderRules) return;

    for (const rule of folderRules) {
      // Check if required folder exists
      if (!this.scanner.isDirectory(rule.path)) {
        const error: ValidationError = {
          type: 'structure-violation',
          severity: this.config.severity || 'error',
          message: `Required directory not found: ${rule.name}`,
          directory: rule.path,
          suggestion: `Create directory at ${rule.path}`
        };

        this.addError(error);
        continue;
      }

      // Get files in this directory
      const dirFiles = files.filter(f => 
        f.path.startsWith(rule.path) && !f.isDirectory
      );

      // Validate file extensions
      if (rule.allowedExtensions) {
        for (const file of dirFiles) {
          if (!rule.allowedExtensions.includes(file.extension)) {
            const error: ValidationError = {
              type: 'forbidden-file',
              severity: 'warning',
              message: `File extension ${file.extension} not allowed in ${rule.name}`,
              file: file.path,
              suggestion: `Allowed extensions: ${rule.allowedExtensions.join(', ')}`
            };

            this.addError(error);
          }
        }
      }

      // Validate naming convention for files in this directory
      if (rule.namingConvention) {
        for (const file of dirFiles) {
          const isValid = validateNamingConvention(file.name, rule.namingConvention);

          if (!isValid) {
            const expected = getExpectedNaming(file.name, rule.namingConvention);

            const error: ValidationError = {
              type: 'naming-violation',
              severity: this.config.severity || 'error',
              message: `File in ${rule.name} doesn't follow ${rule.namingConvention} convention`,
              file: file.path,
              actual: file.name,
              expected,
              suggestion: `Rename to ${expected}`
            };

            this.addError(error);
          }
        }
      }
    }
  }

  private isComponentFile(filename: string, componentName: string): boolean {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt === componentName || 
           nameWithoutExt.toLowerCase() === componentName.toLowerCase();
  }

  private expandPattern(pattern: string, componentName: string): string {
    return pattern.replace(/\*/g, componentName);
  }

  private addError(error: ValidationError): void {
    if (error.severity === 'warning') {
      this.warnings.push(error);
    } else {
      this.errors.push(error);
    }
  }
}

// Made with 
