import { NamingConvention } from '../types';

export function validateNamingConvention(
  filename: string,
  convention: NamingConvention
): boolean {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Remove test/spec/stories suffixes but keep the base name
  const cleanName = nameWithoutExt
    .replace(/\.(test|spec|stories|types|d)$/, '');

  switch (convention) {
    case 'PascalCase':
      return /^[A-Z][a-zA-Z0-9]*$/.test(cleanName);
    
    case 'camelCase':
      return /^[a-z][a-zA-Z0-9]*$/.test(cleanName);
    
    case 'kebab-case':
      return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(cleanName);
    
    case 'snake_case':
      return /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/.test(cleanName);
    
    case 'UPPER_CASE':
      return /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/.test(cleanName);
    
    default:
      return true;
  }
}

export function getExpectedNaming(
  filename: string,
  convention: NamingConvention
): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.substring(nameWithoutExt.length);
  
  let converted = nameWithoutExt;
  
  switch (convention) {
    case 'PascalCase':
      converted = toPascalCase(nameWithoutExt);
      break;
    
    case 'camelCase':
      converted = toCamelCase(nameWithoutExt);
      break;
    
    case 'kebab-case':
      converted = toKebabCase(nameWithoutExt);
      break;
    
    case 'snake_case':
      converted = toSnakeCase(nameWithoutExt);
      break;
    
    case 'UPPER_CASE':
      converted = toUpperCase(nameWithoutExt);
      break;
  }
  
  return converted + ext;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function toUpperCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

// Made with 
