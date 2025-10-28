# frontend/Dockerfile

# --- deps: install ALL deps (incl. dev) for building ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- build: compile Vite/React app to static files ---
FROM node:20-alpine AS build
WORKDIR /app

# Accept API URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Debug: Print the env var to verify it's set
RUN echo "Building with VITE_API_URL=${VITE_API_URL}"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Vite app (outputs to dist/)
RUN npm run build

# Debug: Verify the build output contains the env var
RUN grep -r "VITE_API_URL" dist/ || echo "VITE_API_URL not found in build output" || true

# --- runtime: serve static files with express ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install only express for serving
RUN npm install express

# Copy built static files from build stage
COPY --from=build /app/dist ./dist

# Copy server script
COPY server.js ./

EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
