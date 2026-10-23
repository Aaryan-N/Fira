FROM node:24-alpine

# Fonts so canvas-rendered images (profile cards, colour swatches) can draw text.
RUN apk add --no-cache fontconfig font-dejavu

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY assets ./assets
COPY src ./src
COPY scripts ./scripts

USER node
CMD ["node", "src/index.js"]
