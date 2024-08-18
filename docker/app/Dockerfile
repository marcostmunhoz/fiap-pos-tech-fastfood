FROM node:20.12.2-alpine3.19 AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

FROM base AS dev

RUN yarn build

CMD ["yarn", "start:dev"]

FROM node:20.12.2-alpine3.19 AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node package*.json /app/
COPY --chown=node:node --from=dev /app/dist /app/dist
COPY --chown=node:node --from=dev /app/node_modules /app/node_modules

EXPOSE 3000
USER node

CMD ["yarn", "start:prod"]