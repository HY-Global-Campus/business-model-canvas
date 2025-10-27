# backend/Dockerfile
# --- deps stage: install ALL deps incl. dev ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- build stage: compile TS -> JS ---
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# if your build script is "tsc", this will work now
RUN npm run build

# --- runtime stage: only prod deps + compiled code ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# install only prod deps for a slimmer image
COPY package*.json ./
RUN npm ci --omit=dev

# copy compiled output
COPY --from=build /app/dist ./dist
# copy anything needed at runtime (e.g., prisma schema, migrations, assets)
# COPY --from=build /app/prisma ./prisma

EXPOSE 8080
CMD ["node", "dist/index.js"]
