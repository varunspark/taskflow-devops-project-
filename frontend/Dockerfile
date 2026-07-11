# ---------- Stage 1: Build the React app ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first, install deps - this layer gets cached
# unless package.json actually changes, speeding up rebuilds.
COPY package.json ./
RUN npm install

COPY . .

# Build-time argument for the API URL, so the same Dockerfile works
# whether the backend lives at localhost, a Docker service name, or a real domain.
ARG REACT_APP_API_URL=http://localhost:8080/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
# The final image is just nginx + static files - no Node.js, no source code,
# no node_modules. Small and fast.
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
