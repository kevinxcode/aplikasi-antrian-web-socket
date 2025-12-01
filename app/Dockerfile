FROM node:18-alpine

WORKDIR /app

# Install Python and build tools for native modules
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "index.js"]
