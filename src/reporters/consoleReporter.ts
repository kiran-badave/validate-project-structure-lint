import chalk from 'chalk';
import { ValidationResult, ValidationError } from '../types';

export class ConsoleReporter {
  report(result: ValidationResult): void {
    console.log('\n' + chalk.bold('Project Structure Validation Results'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.gray(`Files scanned: ${result.filesScanned}`));
    console.log(chalk.gray(`Directories scanned: ${result.directoriesScanned}`));
    console.log('');

    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(chalk.green('✓ No issues found!'));
      console.log('');
      return;
    }

    // Report errors
    if (result.errors.length > 0) {
      console.log(chalk.red.bold(`✗ ${result.errors.length} Error${result.errors.length > 1 ? 's' : ''}`));
      console.log('');
      
      result.errors.forEach((error, index) => {
        this.printError(error, index + 1);
      });
    }

    // Report warnings
    if (result.warnings.length > 0) {
      console.log(chalk.yellow.bold(`⚠ ${result.warnings.length} Warning${result.warnings.length > 1 ? 's' : ''}`));
      console.log('');
      
      result.warnings.forEach((warning, index) => {
        this.printWarning(warning, index + 1);
      });
    }

    console.log(chalk.gray('─'.repeat(50)));
    
    if (result.errors.length > 0) {
      console.log(chalk.red.bold(`\n✗ Validation failed with ${result.errors.length} error${result.errors.length > 1 ? 's' : ''}`));
    } else {
      console.log(chalk.yellow.bold(`\n⚠ Validation passed with ${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}`));
    }
    console.log('');
  }

  private printError(error: ValidationError, index: number): void {
    console.log(chalk.red(`${index}. ${error.message}`));
    
    if (error.file) {
      console.log(chalk.gray(`   File: ${error.file}`));
    }
    
    if (error.directory) {
      console.log(chalk.gray(`   Directory: ${error.directory}`));
    }
    
    if (error.actual) {
      console.log(chalk.gray(`   Actual: ${error.actual}`));
    }
    
    if (error.expected) {
      console.log(chalk.gray(`   Expected: ${error.expected}`));
    }
    
    if (error.suggestion) {
      console.log(chalk.cyan(`   💡 ${error.suggestion}`));
    }
    
    console.log('');
  }

  private printWarning(warning: ValidationError, index: number): void {
    console.log(chalk.yellow(`${index}. ${warning.message}`));
    
    if (warning.file) {
      console.log(chalk.gray(`   File: ${warning.file}`));
    }
    
    if (warning.directory) {
      console.log(chalk.gray(`   Directory: ${warning.directory}`));
    }
    
    if (warning.actual) {
      console.log(chalk.gray(`   Actual: ${warning.actual}`));
    }
    
    if (warning.expected) {
      console.log(chalk.gray(`   Expected: ${warning.expected}`));
    }
    
    if (warning.suggestion) {
      console.log(chalk.cyan(`   💡 ${warning.suggestion}`));
    }
    
    console.log('');
  }

  reportConfigError(error: string): void {
    console.log(chalk.red.bold('\n✗ Configuration Error'));
    console.log(chalk.red(error));
    console.log('');
  }

  reportConfigErrors(errors: string[]): void {
    console.log(chalk.red.bold('\n✗ Configuration Errors'));
    errors.forEach(error => {
      console.log(chalk.red(`  • ${error}`));
    });
    console.log('');
  }
}

// Made with 
