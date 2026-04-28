# Fetching the minified node image on apline linux
FROM node:22-slim

# Declaring env
ENV NODE_ENV=production

# Setting up the work directory
WORKDIR /app

# Copying package files
COPY package*.json ./

# Installing dependencies
RUN npm ci --omit=dev

# Installing pm2 globally
RUN npm install pm2 -g

# Copying all the files in our project
COPY . .

# Exposing server port
EXPOSE 5000

# Starting our application with pm2-runtime to keep the container running
CMD ["pm2-runtime", "process.yml"]
