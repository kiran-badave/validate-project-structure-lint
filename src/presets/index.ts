import { Preset } from '../types';
import { reactPreset } from './react';

export const presets: Record<string, Preset> = {
  react: reactPreset
};

export function getPreset(name: string): Preset | undefined {
  return presets[name];
}

export function listPresets(): string[] {
  return Object.keys(presets);
}

// Made with 
