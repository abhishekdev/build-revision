FROM node:14 as base

WORKDIR /project
# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
FROM base as bundle
COPY . .

FROM bundle as test
RUN npm run test

FROM bundle as build
RUN npm run build
