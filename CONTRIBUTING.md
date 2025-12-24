# Contributing to project-structure-lint

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/project-structure-lint.git
cd project-structure-lint
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Run tests**
```bash
npm test
```

## Project Structure

```
project-structure-lint/
├── src/
│   ├── core/           # Core validation logic
│   ├── config/         # Configuration loading
│   ├── presets/        # Built-in presets
│   ├── reporters/      # Output formatters
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── cli.ts          # CLI entry point
│   └── index.ts        # Library entry point
├── tests/              # Test files
└── dist/               # Compiled output
```

## Adding a New Preset

To add a new preset (e.g., Vue, Angular):

1. Create a new file in `src/presets/`:
```typescript
// src/presets/vue.ts
import { Preset } from '../types';

export const vuePreset: Preset = {
  name: 'vue',
  description: 'Vue.js project structure',
  config: {
    // Your configuration here
  }
};
```

2. Export it in `src/presets/index.ts`:
```typescript
import { vuePreset } from './vue';

export const presets: Record<string, Preset> = {
  react: reactPreset,
  vue: vuePreset  // Add your preset
};
```

3. Add tests for your preset

4. Update documentation

## Adding New Validation Rules

1. Add the rule type to `src/types/index.ts`
2. Implement the validation logic in `src/core/validator.ts`
3. Add tests in `src/core/__tests__/`
4. Update documentation

## Testing

- Write unit tests for all new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

```bash
npm test                 # Run tests
npm test -- --coverage   # Run with coverage
```

## Code Style

- Use TypeScript for all new code
- Follow existing code style
- Run linter before committing:
```bash
npm run lint
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add Vue preset`
- `fix: correct naming validation for hooks`
- `docs: update README with examples`
- `test: add tests for file scanner`

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Update documentation
7. Commit your changes
8. Push to your fork
9. Open a Pull Request

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI passes
- Request review from maintainers

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the code
- Documentation improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.