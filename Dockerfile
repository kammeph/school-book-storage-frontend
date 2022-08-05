FROM node:16.16 AS build

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]