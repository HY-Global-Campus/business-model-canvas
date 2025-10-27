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

# --- runtime: serve static files with nginx ---
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Make nginx work with non-root user (for OpenShift)
# nginx needs write access to /var/cache/nginx, /var/run, and /var/log/nginx
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Run as non-root user
USER nginx

# Expose port 8080 for OpenShift compatibility
EXPOSE 8080

# nginx runs in foreground by default
CMD ["nginx", "-g", "daemon off;"]
