FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Host 0.0.0.0 nécessaire pour exposer Vite hors du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]