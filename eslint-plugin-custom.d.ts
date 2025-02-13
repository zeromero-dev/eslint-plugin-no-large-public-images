import { ESLint } from 'eslint';

declare module 'eslint-plugin-custom' {
    
  export interface RuleOptions {
    'no-large-public-images'?: {
      publicDir?: string;
      maxSizeMB?: number;
      allowedExtensions?: string[];
    };
  }

  export interface Plugin extends ESLint.Plugin {
    rules: {
      'no-large-public-images': ESLint.RuleModule;
    };
  }

  const plugin: Plugin;
  export default plugin;
}