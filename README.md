# eslint-plugin-public-dir-image-size

[![npm version](https://img.shields.io/npm/v/eslint-plugin-public-dir-image-size.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-publicimage)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zeromero-dev/eslint-plugin-no-large-public-images/blob/master/LICENSE.md)

An ESLint rule to prevent importing large images from your project's public directory, helping you maintain optimal bundle sizes and application performance.

## Features

- 🚫 Blocks imports of oversized images from public directories
- ⚙️ Configurable maximum file size threshold
- 📁 Supports custom public directory paths
- 🖼️ Filters by common image extensions (jpg, png, etc.)
- 🛠️ Catches both `import` statements and `require()` calls
- 📝 Clear error messages with file details

## Installation

```bash
npm install eslint-plugin-public-dir-image-size --save-dev
```

## Usage

1. Add plugin to your ESLint configuration (`.eslintrc.js`):

```javascript
module.exports = {
  plugins: ["public-dir-image-size"],
  rules: {
    "public-dir-image-size/no-large-images": [
      "error",
      {
        publicDir: "public", // Custom public directory
        maxSizeMB: 1, // Maximum allowed image size (MB)
        allowedExtensions: [
          // Allowed image formats
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
        ],
      },
    ],
  },
};
```

2. The rule will automatically check:
   - `import` statements
   - `require()` calls
   - Both relative and absolute paths to public directory

## Configuration Options

| Option              | Type     | Default                                 | Description                             |
| ------------------- | -------- | --------------------------------------- | --------------------------------------- |
| `publicDir`         | string   | `"public"`                              | Your public directory name              |
| `maxSizeMB`         | number   | `1`                                     | Maximum allowed image size in megabytes |
| `allowedExtensions` | string[] | `["jpg", "jpeg", "png", "gif", "webp"]` | Image formats to check                  |

## Example Error Messages

```javascript
// When image exceeds size limit
Error: Image '/hero.jpg' exceeds maximum size of 1MB.

// When image not found
Error: Image '/missing.png' not found.

// When permission denied
Error: Permission denied when accessing image '/protected.jpg'.
```

## Why Use This?

- 🚨 **Prevent Accidental Large Uploads**: Catch oversized images during development so your Next.js bills won't shock you
- ⏱️ **Performance Guardrails**: Enforce performance best practices
- 🔍 **Early Detection**: Find issues before they reach production

## License

MIT ©. See [LICENSE](LICENSE) for details.

---

**Note**: This rule only checks images imported via absolute paths starting with `/`. Make sure your project structure matches the configured `publicDir`.
