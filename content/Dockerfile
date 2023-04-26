FROM node:18.12.1-alpine

WORKDIR /content

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

CMD [ "node", "index.js" ]

