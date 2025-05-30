# Git Index

Git Index is a Next.js application designed to analyze Git repositories, providing detailed insights into repository structure, file contents, and estimated token counts. It supports efficient repository cloning, file exclusion, and analysis, with a modern UI and containerized deployment using Docker. The application integrates with AWS S3 for file storage and Upstash Redis for rate limiting, making it suitable for both local development and production environments.

![image](https://github.com/user-attachments/assets/9b565d3d-27f6-4b6a-a14e-cb77f37a6749)

## Features

- **Repository Analysis**: Clones Git repositories and generates detailed reports on file count, content, and directory structure.
- **File Exclusion**: Automatically removes excluded files (e.g., `node_modules`, `.git`) based on predefined patterns before analysis.
- **Token Estimation**: Estimates token counts for repository files to assess content complexity.
- **Directory Tree Visualization**: Uses the `tree` command to generate a formatted directory structure.
- **Concurrency Management**: Limits concurrent file operations with `p-limit` for optimized performance.
- **TypeScript Support**: Built with TypeScript for type safety and maintainability.
- **Modern UI**: Leverages Tailwind CSS, Shadcn UI , Radix UI and Lucide React for a responsive, user-friendly interface.
- **Code Quality**: Enforces linting and formatting with Biome and Husky for consistent code standards.
- **Dockerized Deployment**: Multi-stage Docker builds for production using the `oven/bun` image.
- **API Integration**: Uses Hono for server-side routes, with support for rate limiting via Upstash Redis.
- **File Storage**: Integrates with AWS S3 for storing analysis outputs.

## Tech Stack

- **Framework**: Next.js 15.3.2 (with Turbopack for development)
- **Language**: TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS, tw-animate-css
- **UI Components**: Shadcn UI , Radix UI, Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Git Operations**: simple-git
- **API**: Hono
- **File Processing**: AWS SDK for S3, minimatch for pattern matching
- **Rate Limiting**: Upstash Redis and Ratelimit
- **Linting/Formatting**: Biome, Husky
- **Animation**: Motion
- **Containerization**: Docker with Bun

## Prerequisites

- **Bun**: Required for running scripts and local development.
- **Git**: Required for repository cloning.
- **Docker**: Required for containerized deployment.
- **Node.js**: Required for local development (version >= 20.x).
- **AWS Account**: Required for S3 integration.
- **Upstash Redis Account**: Required for rate limiting.

## Installation

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Nayanchandrakar/git-doc.git
   cd git-doc
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   # File Storage (AWS S3)
   S3_ACCESS_KEY_ID=your_aws_access_key
   S3_SECRET_ACCESS_KEY=your_aws_secret_key
   S3_REGION=your_aws_region
   S3_BUCKET=your_bucket_name

   # Rate Limiting (Upstash Redis)
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token

   # App Configuration
   CLIENT_URL=http://localhost:3000
   ```

### Docker Setup

The project uses a multi-stage Dockerfile with the `oven/bun` image for production.

1. **Build the Docker Image**:
   ```bash
   docker build -t git-doc:latest .
   ```

2. **Run in Production Mode**:
   For production with optimized build:
   ```bash
   docker run -p 3000:3000 --env-file .env git-doc:latest
   ```

## Usage

### Local Development

1. **Start the Development Server**:
   ```bash
   bun run dev
   ```
   Access the app at `http://localhost:3000`.

2. **Analyze a Repository**:
   - Navigate to the UI and input:
     - Git repository URL (e.g., `https://github.com/userName/repoName`)
     - Username (e.g., `userName`)
     - Repository name (e.g., `repoName`)
   - The app will:
     - Clone the repository with a shallow clone (`--depth 1`).
     - Remove excluded files (e.g., `node_modules`, `.git`) based on `EXCLUDED_PATTERNS`.
     - Generate a report including:
       - Number of files analyzed
       - Estimated token count
       - Directory tree (using the `tree` command)
       - File contents

3. **Build for Production**:
   ```bash
   bun run build
   ```

4. **Start the Production Server**:
   ```bash
   bun run start
   ```

5. **Lint and Format Code**:
   - Lint:
     ```bash
     bun run lint
     ```
   - Format and check:
     ```bash
     bun run format
     ```

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
3. Commit changes using Conventional Commits:
   ```bash
   git commit -m 'feat: add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feat/your-feature
   ```
5. Open a pull request.

Husky and Biome enforce code quality and commit message standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the framework
- [Bun](https://bun.sh/) for the runtime
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
- [simple-git](https://github.com/steveukx/git-js) for Git operations
- [Hono](https://hono.dev/) for API routes
- [Docker](https://www.docker.com/) for containerization
