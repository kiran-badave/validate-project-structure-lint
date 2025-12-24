import { validateNamingConvention, getExpectedNaming } from '../naming';

describe('validateNamingConvention', () => {
  describe('PascalCase', () => {
    it('should validate correct PascalCase names', () => {
      expect(validateNamingConvention('Button.tsx', 'PascalCase')).toBe(true);
      expect(validateNamingConvention('MyComponent.tsx', 'PascalCase')).toBe(true);
      expect(validateNamingConvention('UserProfile.tsx', 'PascalCase')).toBe(true);
    });

    it('should reject incorrect PascalCase names', () => {
      expect(validateNamingConvention('button.tsx', 'PascalCase')).toBe(false);
      expect(validateNamingConvention('myComponent.tsx', 'PascalCase')).toBe(false);
      expect(validateNamingConvention('user-profile.tsx', 'PascalCase')).toBe(false);
    });
  });

  describe('camelCase', () => {
    it('should validate correct camelCase names', () => {
      expect(validateNamingConvention('useAuth.ts', 'camelCase')).toBe(true);
      expect(validateNamingConvention('formatDate.ts', 'camelCase')).toBe(true);
      expect(validateNamingConvention('getUserData.ts', 'camelCase')).toBe(true);
    });

    it('should reject incorrect camelCase names', () => {
      expect(validateNamingConvention('UseAuth.ts', 'camelCase')).toBe(false);
      expect(validateNamingConvention('format-date.ts', 'camelCase')).toBe(false);
      expect(validateNamingConvention('get_user_data.ts', 'camelCase')).toBe(false);
    });
  });

  describe('kebab-case', () => {
    it('should validate correct kebab-case names', () => {
      expect(validateNamingConvention('my-component.tsx', 'kebab-case')).toBe(true);
      expect(validateNamingConvention('user-profile.tsx', 'kebab-case')).toBe(true);
      expect(validateNamingConvention('format-date.ts', 'kebab-case')).toBe(true);
    });

    it('should reject incorrect kebab-case names', () => {
      expect(validateNamingConvention('MyComponent.tsx', 'kebab-case')).toBe(false);
      expect(validateNamingConvention('userProfile.tsx', 'kebab-case')).toBe(false);
      expect(validateNamingConvention('format_date.ts', 'kebab-case')).toBe(false);
    });
  });

  describe('snake_case', () => {
    it('should validate correct snake_case names', () => {
      expect(validateNamingConvention('my_component.tsx', 'snake_case')).toBe(true);
      expect(validateNamingConvention('user_profile.tsx', 'snake_case')).toBe(true);
      expect(validateNamingConvention('format_date.ts', 'snake_case')).toBe(true);
    });

    it('should reject incorrect snake_case names', () => {
      expect(validateNamingConvention('MyComponent.tsx', 'snake_case')).toBe(false);
      expect(validateNamingConvention('userProfile.tsx', 'snake_case')).toBe(false);
      expect(validateNamingConvention('format-date.ts', 'snake_case')).toBe(false);
    });
  });

  describe('UPPER_CASE', () => {
    it('should validate correct UPPER_CASE names', () => {
      expect(validateNamingConvention('API_CONSTANTS.ts', 'UPPER_CASE')).toBe(true);
      expect(validateNamingConvention('USER_ROLES.ts', 'UPPER_CASE')).toBe(true);
      expect(validateNamingConvention('MAX_LENGTH.ts', 'UPPER_CASE')).toBe(true);
    });

    it('should reject incorrect UPPER_CASE names', () => {
      expect(validateNamingConvention('apiConstants.ts', 'UPPER_CASE')).toBe(false);
      expect(validateNamingConvention('UserRoles.ts', 'UPPER_CASE')).toBe(false);
      expect(validateNamingConvention('max-length.ts', 'UPPER_CASE')).toBe(false);
    });
  });
});

describe('getExpectedNaming', () => {
  it('should convert to PascalCase', () => {
    expect(getExpectedNaming('my-component.tsx', 'PascalCase')).toBe('MyComponent.tsx');
    expect(getExpectedNaming('user_profile.tsx', 'PascalCase')).toBe('UserProfile.tsx');
    expect(getExpectedNaming('formatDate.ts', 'PascalCase')).toBe('FormatDate.ts');
  });

  it('should convert to camelCase', () => {
    expect(getExpectedNaming('MyComponent.tsx', 'camelCase')).toBe('myComponent.tsx');
    expect(getExpectedNaming('user-profile.tsx', 'camelCase')).toBe('userProfile.tsx');
    expect(getExpectedNaming('format_date.ts', 'camelCase')).toBe('formatDate.ts');
  });

  it('should convert to kebab-case', () => {
    expect(getExpectedNaming('MyComponent.tsx', 'kebab-case')).toBe('my-component.tsx');
    expect(getExpectedNaming('userProfile.tsx', 'kebab-case')).toBe('user-profile.tsx');
    expect(getExpectedNaming('formatDate.ts', 'kebab-case')).toBe('format-date.ts');
  });

  it('should convert to snake_case', () => {
    expect(getExpectedNaming('MyComponent.tsx', 'snake_case')).toBe('my_component.tsx');
    expect(getExpectedNaming('userProfile.tsx', 'snake_case')).toBe('user_profile.tsx');
    expect(getExpectedNaming('formatDate.ts', 'snake_case')).toBe('format_date.ts');
  });

  it('should convert to UPPER_CASE', () => {
    expect(getExpectedNaming('myComponent.tsx', 'UPPER_CASE')).toBe('MY_COMPONENT.tsx');
    expect(getExpectedNaming('userProfile.tsx', 'UPPER_CASE')).toBe('USER_PROFILE.tsx');
    expect(getExpectedNaming('formatDate.ts', 'UPPER_CASE')).toBe('FORMAT_DATE.ts');
  });
});

// Made with 
