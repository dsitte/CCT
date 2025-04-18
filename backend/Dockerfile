FROM node:22-slim as base
RUN apt-get update -y && apt-get install -y openssl

FROM base as builder

WORKDIR /app

COPY . .
RUN rm -rf node_modules

RUN yarn
RUN yarn prisma-gen
RUN yarn init-db
RUN yarn build

FROM base

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db" 

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

RUN yarn

CMD node ./dist/serve.js


