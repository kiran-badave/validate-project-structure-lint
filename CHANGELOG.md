# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-24

### Added
- Initial release of project-structure-lint
- Component co-location validation
- File naming convention enforcement (PascalCase, camelCase, kebab-case, snake_case, UPPER_CASE)
- Folder structure validation
- React preset with sensible defaults
- CLI commands: `check`, `init`, `presets`
- Configurable rules via `.validate-structurerc.json`
- Detailed error reporting with suggestions
- Support for ignore patterns
- Programmatic API for integration
- Comprehensive documentation and examples

### Features
- ✅ Validates component files are co-located with tests and stories
- ✅ Enforces naming conventions across different file types
- ✅ Validates project folder structure
- ✅ Configurable severity levels (error/warning)
- ✅ CI/CD integration support
- ✅ Colored console output
- ✅ Glob pattern support for file matching

## [Unreleased]

### Planned
- Vue.js preset
- Angular preset
- Node.js/Express preset
- Auto-fix capability
- JSON/HTML report formats
- VS Code extension
- GitHub Action
- More granular configuration options