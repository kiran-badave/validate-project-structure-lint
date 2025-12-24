#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig, validateConfig } from './config/loader';
import { ProjectValidator } from './core/validator';
import { ConsoleReporter } from './reporters/consoleReporter';
import { listPresets } from './presets';

const program = new Command();

program
  .name('validate-structure')
  .description('Validate project folder structure and file naming conventions')
  .version('1.0.0');

program
  .command('check')
  .description('Validate the project structure')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-r, --root <path>', 'Root directory to validate (default: current directory)')
  .action(async (options) => {
    const reporter = new ConsoleReporter();

    try {
      // Load configuration
      const config = await loadConfig(options.config);

      // Validate configuration
      const configErrors = validateConfig(config);
      if (configErrors.length > 0) {
        reporter.reportConfigErrors(configErrors);
        process.exit(1);
      }

      // Run validation
      const rootDir = options.root || process.cwd();
      const validator = new ProjectValidator(config, rootDir);
      const result = await validator.validate();

      // Report results
      reporter.report(result);

      // Exit with appropriate code
      process.exit(result.valid ? 0 : 1);
    } catch (error) {
      reporter.reportConfigError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a configuration file')
  .option('-p, --preset <name>', 'Preset to use (default: react)', 'react')
  .action(async (options) => {
    const fs = await import('fs');
    const path = await import('path');

    const configPath = path.join(process.cwd(), '.validate-structurerc.json');

    if (fs.existsSync(configPath)) {
      console.log('Configuration file already exists at:', configPath);
      process.exit(1);
    }

    const presetName = options.preset;
    const availablePresets = listPresets();

    if (!availablePresets.includes(presetName)) {
      console.log(`Preset "${presetName}" not found.`);
      console.log('Available presets:', availablePresets.join(', '));
      process.exit(1);
    }

    const config = {
      preset: presetName,
      // Users can customize these
      rules: {
        componentColocation: {
          enabled: true
        }
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Configuration file created at: ${configPath}`);
    console.log(`Using preset: ${presetName}`);
  });

program
  .command('presets')
  .description('List available presets')
  .action(() => {
    const presets = listPresets();
    console.log('\nAvailable presets:');
    presets.forEach(preset => {
      console.log(`  • ${preset}`);
    });
    console.log('');
  });

program.parse();


