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
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# start script
WORKDIR /app

# copy start script for replacing the environment variables
COPY nginx/start-nginx.sh ./start-nginx.sh

RUN chmod +x ./start-nginx.sh

# When Container Start -> Replace Environment Variables
CMD [ "/bin/sh", "-c", "sh start-nginx.sh" ]