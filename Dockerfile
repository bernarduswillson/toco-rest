# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY ./prisma/schema.prisma ./prisma/

RUN npm install
RUN npm uninstall bcrypt
RUN npm install bcrypt@latest --save
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "npm", "start"]