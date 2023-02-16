FROM node:16-alpine as builder

ENV REACT_APP_API_URL=https://veri-toplama-api.afetharita.com

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine as runner

COPY --from=builder /app/build /usr/share/nginx/html
