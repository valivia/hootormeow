FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY prisma/schema.prisma prisma/schema.prisma
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=builder /app/build build/
COPY server.js .
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
COPY prisma prisma

EXPOSE 3000
ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=Infinity
CMD [ "node", "server.js"]
