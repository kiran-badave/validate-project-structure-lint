# Quick Start Guide

Get started with `project-structure-lint` in 5 minutes!

## Installation

```bash
npm install --save-dev project-structure-lint
```

## Step 1: Initialize Configuration

Run the init command to create a configuration file:

```bash
npx validate-structure init
```

This creates `.validate-structurerc.json` with the React preset:

```json
{
  "preset": "react",
  "rules": {
    "componentColocation": {
      "enabled": true
    }
  }
}
```

## Step 2: Run Validation

```bash
npx validate-structure check
```

## Step 3: Add to package.json Scripts

```json
{
  "scripts": {
    "validate": "validate-structure check",
    "precommit": "validate-structure check"
  }
}
```

## Example Project Structure

For a React project, the tool validates this structure:

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx          ✓ Component file
│   │   ├── Button.test.tsx     ✓ Test file
│   │   ├── Button.stories.tsx  ✓ Story file
│   │   └── index.ts            ✓ Export file
│   └── Card/
│       ├── Card.tsx
│       ├── Card.test.tsx
│       └── Card.stories.tsx
├── hooks/
│   ├── useAuth.ts              ✓ camelCase
│   └── useAuth.test.ts
└── utils/
    ├── formatDate.ts           ✓ camelCase
    └── formatDate.test.ts
```

## Common Validation Errors

### Missing Test File
```
✗ Missing required file: Test file for component
  Directory: components/Button
  Expected: Button.test.tsx
  💡 Create Button.test.tsx in components/Button/
```

### Wrong Naming Convention
```
✗ File name doesn't follow PascalCase convention
  File: components/button/button.tsx
  Actual: button.tsx
  Expected: Button.tsx
  💡 Rename to Button.tsx
```

## Customization

Edit `.validate-structurerc.json` to customize:

```json
{
  "preset": "react",
  "rules": {
    "componentColocation": {
      "enabled": true,
      "componentDirs": ["components", "pages", "features"],
      "requiredFiles": [
        {
          "pattern": "*.test.{ts,tsx}",
          "required": true
        },
        {
          "pattern": "*.stories.{ts,tsx}",
          "required": false
        }
      ]
    }
  },
  "ignore": [
    "**/node_modules/**",
    "**/dist/**"
  ]
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Validate Structure
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx validate-structure check
```

### Pre-commit Hook

Using Husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "validate-structure check"
    }
  }
}
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to add new presets
- View [CHANGELOG.md](CHANGELOG.md) for version history

## Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/project-structure-lint/issues)
- 💬 [Discussions](https://github.com/yourusername/project-structure-lint/discussions)