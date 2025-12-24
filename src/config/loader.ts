import { cosmiconfig } from 'cosmiconfig';
import { ProjectConfig } from '../types';
import { getPreset } from '../presets';

const explorer = cosmiconfig('validate-structure');

export async function loadConfig(configPath?: string): Promise<ProjectConfig> {
  let result;

  if (configPath) {
    result = await explorer.load(configPath);
  } else {
    result = await explorer.search();
  }

  if (!result || !result.config) {
    // Return default React preset if no config found
    const reactPreset = getPreset('react');
    if (!reactPreset) {
      throw new Error('Default React preset not found');
    }
    return reactPreset.config;
  }

  const config = result.config as ProjectConfig;

  // If preset is specified, merge with preset config
  if (config.preset) {
    const preset = getPreset(config.preset);
    if (!preset) {
      throw new Error(`Preset "${config.preset}" not found`);
    }

    // Merge preset config with user config (user config takes precedence)
    return mergeConfigs(preset.config, config);
  }

  return config;
}

function mergeConfigs(preset: ProjectConfig, user: ProjectConfig): ProjectConfig {
  return {
    ...preset,
    ...user,
    rules: {
      ...preset.rules,
      ...user.rules,
      componentColocation: user.rules?.componentColocation 
        ? {
            ...preset.rules?.componentColocation,
            ...user.rules.componentColocation
          }
        : preset.rules?.componentColocation,
      fileNaming: {
        ...preset.rules?.fileNaming,
        ...user.rules?.fileNaming
      },
      folderStructure: user.rules?.folderStructure || preset.rules?.folderStructure
    },
    ignore: [...(preset.ignore || []), ...(user.ignore || [])]
  };
}

export function validateConfig(config: ProjectConfig): string[] {
  const errors: string[] = [];

  if (config.rules?.componentColocation?.enabled) {
    if (!config.rules.componentColocation.componentDirs?.length) {
      errors.push('componentColocation.componentDirs must be specified when enabled');
    }
    if (!config.rules.componentColocation.requiredFiles?.length) {
      errors.push('componentColocation.requiredFiles must be specified when enabled');
    }
  }

  return errors;
}

// Made with 
