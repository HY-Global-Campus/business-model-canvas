FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
	npm install --include=dev; \
	else \
	npm install --only=production; \
	fi

COPY . .

EXPOSE 80

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev:watch; else tsx src/index.ts; fi"]



