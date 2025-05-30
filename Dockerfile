ARG NODE_VERSION=22.16.0
ARG BUN_VERSION=latest

# Development Stage
FROM oven/bun:${BUN_VERSION} AS development
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# Production Stage
FROM node:${NODE_VERSION} AS production
WORKDIR /app

# Install tree (needed for GitAnalyzerService runtime)
RUN apt-get update && apt-get install -y tree && apt-get clean

# Copy the built artifacts from the builder stage
COPY --from=development /app/.next/standalone ./
COPY --from=development /app/.next/static ./.next/static

# Set the environment variables
ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]