from node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run","prod"]