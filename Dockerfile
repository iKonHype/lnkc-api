FROM node:18.17.0-alpine3.18

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY ./package.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD ["node", "dist/main"]