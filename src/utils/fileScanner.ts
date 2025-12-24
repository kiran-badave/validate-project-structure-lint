import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import micromatch from 'micromatch';

export interface ScannedFile {
  path: string;
  name: string;
  directory: string;
  extension: string;
  isDirectory: boolean;
}

export class FileScanner {
  private rootDir: string;
  private ignorePatterns: string[];

  constructor(rootDir: string, ignorePatterns: string[] = []) {
    this.rootDir = path.resolve(rootDir);
    this.ignorePatterns = ignorePatterns;
  }

  async scanDirectory(dir: string = this.rootDir): Promise<ScannedFile[]> {
    const files: ScannedFile[] = [];
    
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.rootDir, fullPath);

        // Skip ignored paths
        if (this.shouldIgnore(relativePath)) {
          continue;
        }

        const scannedFile: ScannedFile = {
          path: relativePath,
          name: entry.name,
          directory: path.relative(this.rootDir, dir),
          extension: path.extname(entry.name),
          isDirectory: entry.isDirectory()
        };

        files.push(scannedFile);

        // Recursively scan subdirectories
        if (entry.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }

    return files;
  }

  async findFiles(pattern: string, baseDir?: string): Promise<string[]> {
    const searchDir = baseDir ? path.join(this.rootDir, baseDir) : this.rootDir;
    
    try {
      const files = await glob(pattern, {
        cwd: searchDir,
        ignore: this.ignorePatterns,
        nodir: true
      });
      
      return files.map(file => 
        baseDir ? path.join(baseDir, file) : file
      );
    } catch (error) {
      console.error(`Error finding files with pattern ${pattern}:`, error);
      return [];
    }
  }

  async getDirectoryContents(dir: string): Promise<ScannedFile[]> {
    const fullPath = path.join(this.rootDir, dir);
    const files: ScannedFile[] = [];

    try {
      const entries = await fs.promises.readdir(fullPath, { withFileTypes: true });

      for (const entry of entries) {
        const relativePath = path.join(dir, entry.name);

        if (this.shouldIgnore(relativePath)) {
          continue;
        }

        files.push({
          path: relativePath,
          name: entry.name,
          directory: dir,
          extension: path.extname(entry.name),
          isDirectory: entry.isDirectory()
        });
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      return [];
    }

    return files;
  }

  getComponentDirectories(componentDirs: string[]): string[] {
    const dirs: string[] = [];

    for (const dir of componentDirs) {
      const fullPath = path.join(this.rootDir, dir);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }

      try {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const relativePath = path.join(dir, entry.name);
            if (!this.shouldIgnore(relativePath)) {
              dirs.push(relativePath);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading component directory ${fullPath}:`, error);
      }
    }

    return dirs;
  }

  private shouldIgnore(filePath: string): boolean {
    if (this.ignorePatterns.length === 0) {
      return false;
    }

    return micromatch.isMatch(filePath, this.ignorePatterns);
  }

  fileExists(filePath: string): boolean {
    const fullPath = path.join(this.rootDir, filePath);
    return fs.existsSync(fullPath);
  }

  isDirectory(filePath: string): boolean {
    const fullPath = path.join(this.rootDir, filePath);
    try {
      return fs.statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  }
}

// Made with 
