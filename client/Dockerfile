from node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
run npm run build
CMD ["npm", "run","start"]