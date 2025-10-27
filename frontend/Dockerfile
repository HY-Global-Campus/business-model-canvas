# frontend/Dockerfile

# --- deps: install ALL deps (incl. dev) for building ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- build: compile Vite/React app to static files ---
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Vite app (outputs to dist/)
RUN npm run build

# --- runtime: serve static files with a simple server ---
FROM node:20-alpine AS runner
WORKDIR /app

# Install serve package globally for serving static files
RUN npm install -g serve

# Copy built static files from build stage
COPY --from=build /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Serve the static files on port 8080, with SPA fallback
CMD ["serve", "-s", "dist", "-l", "8080"]
