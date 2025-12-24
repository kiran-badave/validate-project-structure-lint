# project-structure-lint

A powerful CLI tool to validate project folder structure and file naming conventions with configurable presets. Perfect for maintaining consistency across React, Vue, Angular, and other JavaScript/TypeScript projects.

## Features

✅ **Component Co-location Validation** - Ensures all related files (tests, stories, styles) are in the same folder  
✅ **File Naming Convention Enforcement** - Supports PascalCase, camelCase, kebab-case, snake_case, and UPPER_CASE  
✅ **Folder Structure Validation** - Enforces project directory organization  
✅ **Configurable Presets** - Built-in React preset with easy customization  
✅ **Detailed Error Reporting** - Clear messages with suggestions for fixes  
✅ **CI/CD Integration** - Exit codes for automated workflows  

## Installation

```bash
npm install --save-dev project-structure-lint
```

Or use globally:

```bash
npm install -g project-structure-lint
```

## Quick Start

### 1. Initialize Configuration

```bash
npx validate-structure init
```

This creates a `.validate-structurerc.json` file with the React preset.

### 2. Run Validation

```bash
npx validate-structure check
```

## Usage

### Commands

#### `check`
Validate your project structure:

```bash
validate-structure check [options]

Options:
  -c, --config <path>  Path to configuration file
  -r, --root <path>    Root directory to validate (default: current directory)
```

#### `init`
Initialize a configuration file:

```bash
validate-structure init [options]

Options:
  -p, --preset <name>  Preset to use (default: react)
```

#### `presets`
List available presets:

```bash
validate-structure presets
```

## Configuration

### Using Presets

The easiest way to get started is using a preset:

```json
{
  "preset": "react"
}
```

### Custom Configuration

Create a `.validate-structurerc.json` file:

```json
{
  "preset": "react",
  "rootDir": "src",
  "rules": {
    "componentColocation": {
      "enabled": true,
      "componentDirs": ["components", "pages", "features"],
      "requiredFiles": [
        {
          "pattern": "*.test.{ts,tsx}",
          "required": true,
          "description": "Test file"
        },
        {
          "pattern": "*.stories.{ts,tsx}",
          "required": true,
          "description": "Storybook story"
        }
      ],
      "namingConvention": "PascalCase"
    },
    "fileNaming": {
      "components/**/*.{tsx,jsx}": {
        "convention": "PascalCase",
        "severity": "error"
      },
      "hooks/**/*.{ts,tsx}": {
        "convention": "camelCase",
        "severity": "error"
      },
      "utils/**/*.{ts,js}": {
        "convention": "camelCase",
        "severity": "error"
      }
    },
    "folderStructure": [
      {
        "name": "components",
        "path": "src/components",
        "namingConvention": "PascalCase",
        "allowedExtensions": [".tsx", ".ts", ".css", ".scss"]
      }
    ]
  },
  "ignore": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ],
  "severity": "error"
}
```

## Configuration Options

### `preset`
- Type: `string`
- Available: `"react"`
- Use a predefined configuration preset

### `rootDir`
- Type: `string`
- Default: `"src"`
- Root directory for validation

### `rules.componentColocation`

Validates that component files are co-located with their tests, stories, etc.

```json
{
  "enabled": true,
  "componentDirs": ["components", "pages"],
  "requiredFiles": [
    {
      "pattern": "*.test.tsx",
      "required": true,
      "description": "Test file"
    }
  ],
  "namingConvention": "PascalCase"
}
```

### `rules.fileNaming`

Enforces naming conventions for files matching patterns:

```json
{
  "components/**/*.tsx": {
    "convention": "PascalCase",
    "severity": "error"
  }
}
```

**Supported conventions:**
- `PascalCase` - `MyComponent.tsx`
- `camelCase` - `useAuth.ts`
- `kebab-case` - `my-component.tsx`
- `snake_case` - `my_component.tsx`
- `UPPER_CASE` - `API_CONSTANTS.ts`

### `rules.folderStructure`

Validates directory structure and contents:

```json
{
  "name": "components",
  "path": "src/components",
  "namingConvention": "PascalCase",
  "allowedExtensions": [".tsx", ".ts", ".css"]
}
```

### `ignore`

Patterns to ignore (uses glob syntax):

```json
{
  "ignore": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.ts"
  ]
}
```

### `severity`

Default severity level:
- `"error"` - Fails validation
- `"warning"` - Shows warning but passes

## Examples

### React Component Structure

For a component named `Button`, the tool validates:

```
components/
└── Button/
    ├── Button.tsx          ✓ Main component
    ├── Button.test.tsx     ✓ Test file
    ├── Button.stories.tsx  ✓ Storybook story
    ├── Button.module.css   ✓ Styles
    └── index.ts            ✓ Re-export
```

### Naming Convention Validation

```typescript
// ✓ Valid
components/Button/Button.tsx
hooks/useAuth.ts
utils/formatDate.ts

// ✗ Invalid
components/button/button.tsx  // Should be PascalCase
hooks/UseAuth.ts              // Should be camelCase
utils/format_date.ts          // Should be camelCase
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# GitHub Actions
- name: Validate Project Structure
  run: npx validate-structure check
```

```json
// package.json
{
  "scripts": {
    "validate": "validate-structure check",
    "precommit": "validate-structure check"
  }
}
```

## Programmatic Usage

```typescript
import { ProjectValidator, loadConfig } from 'project-structure-lint';

async function validate() {
  const config = await loadConfig();
  const validator = new ProjectValidator(config, process.cwd());
  const result = await validator.validate();
  
  console.log(`Valid: ${result.valid}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
}
```

## Output Example

```
Project Structure Validation Results
──────────────────────────────────────────────────
Files scanned: 45
Directories scanned: 12

✗ 2 Errors

1. Missing required file: Test file for component
   Directory: components/Button
   Expected: Button.test.tsx
   💡 Create Button.test.tsx in components/Button/

2. File name doesn't follow PascalCase convention
   File: components/myComponent/myComponent.tsx
   Actual: myComponent.tsx
   Expected: MyComponent.tsx
   💡 Rename to MyComponent.tsx

──────────────────────────────────────────────────

✗ Validation failed with 2 errors
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Created with ❤️ for better project organization