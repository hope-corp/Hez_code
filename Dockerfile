FROM node:18-alpine

# Install Python 3 and native dependencies
RUN apk add --no-cache python3 py3-pip bash py3-requests py3-beautifulsoup4

# Install typescript and ts-node globally
RUN npm install -g typescript ts-node

WORKDIR /app

COPY . .

WORKDIR /app/dashboard
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
