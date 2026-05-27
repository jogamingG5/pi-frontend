# Frontend multi-stage Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY streetleague/package*.json ./
RUN npm ci
COPY streetleague/ .
RUN npx ng build --prod

FROM nginx:alpine
COPY --from=build /app/dist/streetleague /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
