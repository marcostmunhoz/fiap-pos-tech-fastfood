FROM node:20.12.2-alpine3.19

WORKDIR /app

# Install yarn as its needed for the project
RUN apk add --no-cache yarn

# Install dependencies
RUN yarn install

CMD ["yarn", "start:dev"]