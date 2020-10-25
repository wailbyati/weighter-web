FROM node:12-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN NODE_ENV= npm ci
COPY . .
RUN npm run build:placeholderenv

EXPOSE 8080
CMD ["npm", "run", "replaceenv-serve"]
