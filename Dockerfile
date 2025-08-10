# Build arguments
ARG NODE_VERSION=18
ARG NGINX_VERSION=alpine
ARG PORT=8080

# Build stage
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev deps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:${NGINX_VERSION}

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx configuration from template
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Set environment variable for port (nginx will substitute in template)
ENV PORT=8080

# Expose the configured port  
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 