# syntax=docker/dockerfile:1
FROM node:20-bookworm

# Install LibreOffice for document conversion
RUN apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends libreoffice && \
	rm -rf /var/lib/apt/lists/*

ARG NODE_ENV

WORKDIR /usr/src/app

# Copy manifests first for caching
COPY package*.json ./

# Install dependencies (including dev deps for build step)
RUN npm ci

# Copy source
COPY . .

# Always build so dist/ exists in all images
RUN npm run build

# Prune dev dependencies for non-development images
RUN if [ "$NODE_ENV" != "development" ]; then \
	npm prune --omit=dev; \
	fi

RUN chown -R node:node /usr/src/app

EXPOSE 8080

USER node

# Dev: nodemon + ts-node/esm; Prod: compiled JS
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev:watch; else node dist/index.mjs; fi"]
