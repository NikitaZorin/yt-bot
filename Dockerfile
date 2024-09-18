FROM node:alpine AS build


# package.json, package-lock.json
COPY package*.json ./

# Run depends
RUN npm install

COPY . .

# Build
RUN npm run build

# PORT
EXPOSE 3000


# run app
CMD ["npm", "run", "start:prod"]