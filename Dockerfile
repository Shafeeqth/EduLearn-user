# Stage 1: Build 
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN yarn run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/src/infrastructure/frameworks/gRPC/protos ./dist//infrastructure/frameworks/gRPC/protos

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Install runtime dependencies
RUN apk add --no-cache tini
RUN apk add --no-cache curl

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Ensure appuser can write to /app and create logs at runtime
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

USER appuser


# Expose the application port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start the application
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "run", "start"]