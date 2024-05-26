FROM node:20.12.2-alpine3.19 AS build

WORKDIR /app

# Install yarn as its needed for the project
RUN apk add --no-cache yarn

USER node

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build

FROM node:20.12.2-alpine3.19 AS dev

WORKDIR /app

USER node

COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start:dev"]

FROM node:20.12.2-alpine3.19 AS prod

WORKDIR /app

USER node

COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]