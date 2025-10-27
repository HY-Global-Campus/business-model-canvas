# frontend/Dockerfile (dev)
FROM node:20-alpine

# Ensure writable, random UID friendly locations
ENV HOME=/tmp \
	npm_config_cache=/tmp/.npm

WORKDIR /usr/src/app

# Install deps first (leverages layer cache)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

RUN chgrp -R 0 /usr/src/app && \
	chmod -R g=u /usr/src/app

EXPOSE 5173

# Run dev server on all interfaces with fixed port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
