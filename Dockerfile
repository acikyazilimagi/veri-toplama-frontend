FROM node:16-alpine as builder

ARG API_URL
ENV REACT_APP_API_URL=${API_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine as runner

COPY --from=builder /app/build /usr/share/nginx/html
