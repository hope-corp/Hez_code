FROM node:18-alpine

# Install Python 3, pip, bash, requests, and beautifulsoup4 natively via Alpine
RUN apk add --no-cache python3 py3-pip bash py3-requests py3-beautifulsoup4

WORKDIR /app

# Copy the entire project into the container
COPY . .

# Navigate into the dashboard folder, install Node dependencies, and build the Next.js app
WORKDIR /app/dashboard
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
