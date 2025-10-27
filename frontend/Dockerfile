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

# Expose port 8080
EXPOSE 8080

# Run the server
CMD ["node", "server.js"]
