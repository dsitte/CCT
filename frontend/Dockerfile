FROM node:22-slim as builder

WORKDIR /app

COPY . .
RUN rm -rf node_modules

RUN yarn
RUN yarn build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html
