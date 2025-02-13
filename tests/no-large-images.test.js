const { RuleTester } = require("eslint");
const fs = require("fs");

// Import the rule; adjust the path to your actual rule file.
const ruleImport = require("../rules/no-large-public-images");
const rule = ruleImport.default || ruleImport;

if (typeof rule.create !== "function") {
  throw new Error(
    "Imported rule does not have a create method. Verify your export."
  );
}

// Mock file system behavior.
jest.mock("fs");
fs.existsSync.mockImplementation((filePath) =>
  filePath.includes("public/images/large-image.jpg")
);
fs.statSync.mockImplementation((filePath) => ({
  size: filePath.includes("large-image.jpg") ? 2 * 1024 * 1024 : 500 * 1024,
}));

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
});

ruleTester.run("no-large-images", rule, {
  valid: [
    {
      code: "import smallImage from '/images/small-image.jpg';",
      options: [{ publicDir: "public", maxSizeMB: 1 }],
    },
    {
      code: "const img = require('/images/small-image.jpg');",
      options: [{ publicDir: "public", maxSizeMB: 1 }],
    },
  ],
  invalid: [
    {
      code: "import largeImage from '/images/large-image.jpg';",
      options: [{ publicDir: "public", maxSizeMB: 1 }],
      errors: [
        {
          message:
            "Image '/images/large-image.jpg' exceeds maximum size of 1MB.",
        },
      ],
    },
    {
      code: "const largeImage = require('/images/large-image.jpg');",
      options: [{ publicDir: "public", maxSizeMB: 1 }],
      errors: [
        {
          message:
            "Image '/images/large-image.jpg' exceeds maximum size of 1MB.",
        },
      ],
    },
  ],
});
