FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

USER node

HEALTHCHECK --interval=30s CMD node -e "require('./src/index.js')"

CMD ["node", "src/index.js"]
