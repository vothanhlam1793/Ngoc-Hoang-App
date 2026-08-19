FROM node:16.20.1-alpine3.18 AS build

WORKDIR /app

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build \
    && npm prune --omit=dev \
    && npm cache clean --force

FROM node:16.20.1-alpine3.18 AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000

COPY --from=build --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.nuxt ./.nuxt
COPY --from=build --chown=node:node /app/content ./content
COPY --from=build --chown=node:node /app/schemes ./schemes
COPY --from=build --chown=node:node /app/static ./static
COPY --from=build --chown=node:node /app/nuxt.config.js ./nuxt.config.js

USER node

EXPOSE 3000

CMD ["node", "node_modules/nuxt/bin/nuxt.js", "start"]
