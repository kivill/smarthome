FROM node:10-alpine

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# COPY ./package.json /usr/src/app/
# RUN npm install
# COPY . /usr/src/app

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]