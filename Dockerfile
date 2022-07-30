FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3005

CMD ["node", "dist/server.js"]