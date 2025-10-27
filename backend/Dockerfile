# backend/Dockerfile

# --- deps: install ALL deps (incl. dev) for building ---
	FROM node:20-alpine AS deps
	WORKDIR /app
	COPY package*.json ./
	RUN npm ci
	
	# --- build: compile TS -> JS using dev deps ---
	FROM node:20-alpine AS build
	WORKDIR /app
	COPY --from=deps /app/node_modules ./node_modules
	COPY . .
	# expects "build": "tsc" (or tsc + something) in package.json
	RUN npm run build
	
	# --- runtime: only prod deps + compiled output ---
	FROM node:20-alpine AS runner
	ENV NODE_ENV=production
	WORKDIR /app
	
	# install only prod deps
	COPY package*.json ./
	RUN npm ci --omit=dev
	
	# copy compiled app (adjust if your outDir differs)
	COPY --from=build /app/dist ./dist
	
	# (optional) copy runtime assets (env files, prisma, migrations, static, etc.)
	# COPY --from=build /app/prisma ./prisma
	# COPY --from=build /app/.env.production ./.env
	
	# If you’ll run on OpenShift with random UID, keep group-writable:
	# RUN chgrp -R 0 /app && chmod -R g=u /app
	
	EXPOSE 8080
	CMD ["node", "dist/index.js"]
