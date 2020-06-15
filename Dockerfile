FROM node:slim
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .