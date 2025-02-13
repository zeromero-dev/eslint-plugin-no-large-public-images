const path = require("path");
const fs = require("fs");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Prevent importing large images from the public directory",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          publicDir: { type: "string", default: "public" },
          maxSizeMB: { type: "number", default: 1 }, // Default size in MB
          allowedExtensions: {
            type: "array",
            items: { type: "string" },
            default: ["jpg", "jpeg", "png", "gif", "webp"],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const publicDir = options.publicDir || "public";
    const maxSizeMB = options.maxSizeMB || 1; // Default to 1MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    const allowedExtensions = new Set(
      (options.allowedExtensions || ["jpg", "jpeg", "png", "gif", "webp"]).map(
        (ext) => ext.toLowerCase()
      )
    );

    function checkImageImport(node, importPath) {
      if (typeof importPath !== "string") return;

      const extension = importPath.split(".").pop().toLowerCase();
      if (!allowedExtensions.has(extension)) return;

      if (!importPath.startsWith("/")) return;

      const projectRoot = process.cwd();
      const normalizedImportPath = importPath.startsWith("/")
        ? importPath.slice(1)
        : importPath;
      const imagePath = path.join(projectRoot, publicDir, normalizedImportPath);

      if (!fs.existsSync(imagePath)) return;

      try {
        const stats = fs.statSync(imagePath);
        if (stats.size > maxSizeBytes) {
          context.report({
            node,
            message: `Image '${importPath}' exceeds maximum size of ${maxSizeMB}MB.`,
          });
        }
      } catch (error) {
        // Handle error if file cannot be accessed
        if (error.code === "ENOENT") {
          context.report({
            node,
            message: `Image '${importPath}' not found.`,
          });
        } else if (error.code === "EACCES") {
          context.report({
            node,
            message: `Permission denied when accessing image '${importPath}'.`,
          });
        } else {
          context.report({
            node,
            message: `Error accessing image '${importPath}': ${error.message}`,
          });
        }
      }
    }

    return {
      ImportDeclaration(node) {
        checkImageImport(node, node.source.value);
      },
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require" &&
          node.arguments[0] &&
          node.arguments[0].type === "Literal" &&
          typeof node.arguments[0].value === "string"
        ) {
          checkImageImport(node, node.arguments[0].value);
        }
      },
    };
  },
};
