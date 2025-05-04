# Currently theres an issue with turborepo & bun lockfile
# https://github.com/vercel/turborepo/issues/10410
# FIXME: after that issue has been fixed

FROM oven/bun AS base

FROM base AS builder
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile \
  && bun run build \
  && mv /app/apps/frontend/dist /app/apps/backend/dist \
  && rm -rf /app/apps/frontend

FROM base AS runner
WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "run", "apps/backend/bin/serve.ts"]