FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 build-base openssl1.1-compat
ENV PYTHON=/usr/bin/python3
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start"]
