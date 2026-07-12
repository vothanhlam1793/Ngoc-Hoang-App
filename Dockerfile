FROM node:16.20.1-alpine3.18

RUN apk add --no-cache git

WORKDIR /usr/src/nuxt-app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG BACKEND_HOST=v1-backend
ARG BACKEND_PORT=3000
ENV BACKEND_HOST=$BACKEND_HOST
ENV BACKEND_PORT=$BACKEND_PORT

RUN npm run build

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["npm", "start"]
