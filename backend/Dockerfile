FROM node:22-slim as base
RUN apt-get update -y && apt-get install -y openssl

FROM base as builder

WORKDIR /app

ENV DATABASE_URL="file:./dev.db" 

COPY . .
RUN rm -rf node_modules dist

RUN yarn \
  && yarn prisma-gen \
  && yarn build \
  && yarn init-db

FROM base

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db" 

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

RUN yarn

CMD node ./dist/serve.js


