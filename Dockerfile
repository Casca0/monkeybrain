FROM node:lts

WORKDIR /

COPY package*.json ./

RUN apt update

RUN npm install && npm install -g typescript

COPY . .

RUN tsc

CMD [ "node", "dist/index.js" ]
