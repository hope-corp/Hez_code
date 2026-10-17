FROM node:18-alpine

# Install Python 3, pip, and bash
RUN apk add --no-cache python3 py3-pip bash

WORKDIR /app

# Copy the entire project into the container
COPY . .

# Install Python dependencies globally or via requirements.txt if present
RUN pip3 install --no-cache-dir requests

# If you have a requirements.txt file in your root, uncomment the line below:
# RUN pip3 install --no-cache-dir -r requirements.txt

# Navigate into the dashboard folder, install Node dependencies, and build the Next.js app
WORKDIR /app/dashboard
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
