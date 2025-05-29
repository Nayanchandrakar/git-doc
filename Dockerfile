ARG VERSION=latest

# Development Stage
FROM oven/bun:${VERSION} AS development
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# Production Stage
FROM oven/bun:${VERSION} AS production
WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=development /app/.next/standalone ./
COPY --from=development /app/.next/static ./.next/static

# Set the environment variables
ENV NODE_ENV=production

EXPOSE 3000
ENTRYPOINT ["bun", "server.js"]