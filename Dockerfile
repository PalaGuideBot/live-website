FROM node:22.13-alpine3.21 AS base
WORKDIR /app

# Base installer
FROM base AS installer
ENV COREPACK_INTEGRITY_KEYS=0
RUN corepack enable
COPY . .

# Production only deps stage
FROM installer AS production-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM installer AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --ignore-ts-errors

# Production stage
FROM base
ENV NODE_ENV=production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build .
EXPOSE 3333
CMD ["node", "./bin/server.js"]