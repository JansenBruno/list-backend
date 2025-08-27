FROM node:20-alpine as deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund || true

FROM node:20-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund || true
EXPOSE 3333
VOLUME ["/app/data"]
ENV SQLITE_PATH=/app/data/database.sqlite
CMD ["node", "dist/server.js"]  