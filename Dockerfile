FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip bash

WORKDIR /app

COPY . .

WORKDIR /app/dashboard
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
