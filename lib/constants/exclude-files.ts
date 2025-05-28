export const EXCLUDED_PATTERNS = [
  // Folders
  "node_modules",
  ".git",
  "dist",
  "build",
  "out",
  "coverage",
  "public",
  "assets",
  "static",
  "tmp",
  "temp",
  "tests",
  "__tests__",
  "test",
  "__test__",
  "spec",
  ".git",
  ".github",
  ".vscode",
  ".idea",

  // Environment and config files
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".npmrc",
  ".yarnrc",
  ".editorconfig",
  ".prettierrc",
  ".eslintrc",
  ".eslintignore",
  ".gitignore",
  ".gitattributes",
  ".dockerignore",
  "docker-compose.yml",

  // Lock files
  "package-lock.json",
  "pnpm-lock.yaml",
  "bun.lock",
  "bun.lockb",
  "*.lock",
  "*.pid",
  "*.pid.lock",

  // Logs and temp
  "*.log",
  "npm-debug.log",
  "yarn-error.log",
  "*.bak",
  "*.swp",
  "*.swo",
  "*.seed",
  ".DS_Store",
  "Thumbs.db",

  // Binary and archive files
  "*.zip",
  "*.tar.gz",
  "*.tgz",
  "*.swf",

  // Fonts and icons
  "*.woff",
  "*.woff2",
  "*.ttf",
  "*.eot",
  "*.otf",
  "*.ico",

  // Images
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.svg",

  // Minified assets
  "*.min.js",
  "*.min.css",

  // Misc
  "LICENSE",
  "*.md",
  "*.md.bak",
  "*.sqlite",
  "*.db",

  // Test files
  "*.spec.js",
  "*.test.js",
  "*.spec.ts",
  "*.test.ts",
  "**/*.test.*",
  "**/*.spec.*",
  "**/*.min.*",

  // Config files
  "jest.config.js",
  "rollup.config.js",
  "webpack.config.js",
  "vite.config.js",
]
