# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY ./prisma/schema.prisma ./prisma/
COPY nodemon.json ./nodemon.json

# Install application dependencies
RUN npm install

# Install ts-node
RUN npm install -g ts-node

# Install bcrypt and generate Prisma client
RUN npm install bcrypt@latest
RUN npx prisma generate

# Copy the rest of your application code to the container
COPY . .

# Expose the port your application will listen on (assuming it's 5000)
EXPOSE 5000

# Start your TypeScript application using nodemon
CMD ["npx", "nodemon", "--config", "nodemon.json"]
