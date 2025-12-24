import { Preset } from '../types';

export const reactPreset: Preset = {
  name: 'react',
  description: 'React project with component co-location and testing requirements',
  config: {
    preset: 'react',
    rootDir: 'src',
    rules: {
      componentColocation: {
        enabled: true,
        componentDirs: ['components', 'pages', 'features'],
        requiredFiles: [
          {
            pattern: '*.test.{ts,tsx,js,jsx}',
            required: true,
            description: 'Test file for component'
          },
          {
            pattern: '*.stories.{ts,tsx,js,jsx}',
            required: true,
            description: 'Storybook story file'
          },
          {
            pattern: 'index.{ts,tsx,js,jsx}',
            required: false,
            description: 'Index file for re-exports'
          }
        ],
        namingConvention: 'PascalCase'
      },
      fileNaming: {
        'components/**/*.{tsx,jsx}': {
          convention: 'PascalCase',
          severity: 'error'
        },
        'hooks/**/*.{ts,tsx,js,jsx}': {
          convention: 'camelCase',
          severity: 'error'
        },
        'utils/**/*.{ts,js}': {
          convention: 'camelCase',
          severity: 'error'
        },
        'types/**/*.{ts,tsx}': {
          convention: 'PascalCase',
          severity: 'error'
        },
        'constants/**/*.{ts,js}': {
          convention: 'UPPER_CASE',
          severity: 'warning'
        }
      },
      folderStructure: [
        {
          name: 'components',
          path: 'src/components',
          namingConvention: 'PascalCase',
          allowedExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.module.css']
        },
        {
          name: 'hooks',
          path: 'src/hooks',
          namingConvention: 'camelCase',
          allowedExtensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        {
          name: 'utils',
          path: 'src/utils',
          namingConvention: 'camelCase',
          allowedExtensions: ['.ts', '.js']
        },
        {
          name: 'types',
          path: 'src/types',
          namingConvention: 'PascalCase',
          allowedExtensions: ['.ts', '.d.ts']
        }
      ]
    },
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.git/**'
    ],
    severity: 'error'
  }
};

// Made with 
