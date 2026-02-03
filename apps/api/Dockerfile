FROM node:20-bullseye-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 build-essential \
  && rm -rf /var/lib/apt/lists/*
ENV PYTHON=/usr/bin/python3
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start"]
