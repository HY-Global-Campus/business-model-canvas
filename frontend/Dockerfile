# syntax=docker/dockerfile:1

# --- deps: install ALL deps (incl. dev) for building ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- dev: local development with Vite dev server ---
FROM node:20-alpine AS dev
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci
COPY . .
RUN chown -R node:node /app
USER node
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT:-5173} --strictPort"]

# --- build: compile Vite/React app to static files ---
FROM node:20-alpine AS build
WORKDIR /app

# Accept API URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Vite app (outputs to dist/)
RUN npm run build

# --- runtime: serve static files with express ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install only the static file server dependency.
RUN npm install express@4.19.2 --omit=dev --no-audit --no-fund

# Copy built static files from build stage
COPY --from=build /app/dist ./dist

# Copy server script
COPY server.js ./

EXPOSE 3000

USER node

# Run the server
CMD ["node", "server.js"]
