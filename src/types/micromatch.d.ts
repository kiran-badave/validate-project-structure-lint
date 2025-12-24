declare module 'micromatch' {
  function micromatch(
    list: string | string[],
    patterns: string | string[],
    options?: micromatch.Options
  ): string[];

  namespace micromatch {
    interface Options {
      ignore?: string | string[];
      matchBase?: boolean;
      nobrace?: boolean;
      nocase?: boolean;
      noext?: boolean;
      noglobstar?: boolean;
      nonull?: boolean;
      dot?: boolean;
    }

    function isMatch(
      str: string,
      patterns: string | string[],
      options?: Options
    ): boolean;

    function makeRe(
      pattern: string,
      options?: Options
    ): RegExp;

    function match(
      list: string[],
      patterns: string | string[],
      options?: Options
    ): string[];
  }

  export = micromatch;
}

// Made with 
