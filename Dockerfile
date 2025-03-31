# Stage 1: Build Stage
FROM node:22-alpine AS build

WORKDIR /app/node-express

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Stage 2: Production Stage
FROM node:22-alpine

# Install pm2 globally
RUN npm install pm2 -g

WORKDIR /app/node-express

# Install required system dependencies for bcrypt
RUN apk add --no-cache python3 make g++ curl tzdata

# Copy built app from build stage
COPY --from=build /app/node-express . 

# Ensure bcrypt is rebuilt for Alpine
RUN npm rebuild bcrypt --build-from-source

# Expose necessary port
EXPOSE 50001

CMD ["pm2-runtime", "./src/server.js"]
