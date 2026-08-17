# Build client + bundle server for production
FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/patches ./patches
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate \
  && pnpm install --frozen-lockfile --prod \
  && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
