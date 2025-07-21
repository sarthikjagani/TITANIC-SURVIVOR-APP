# web-frontend/Dockerfile (Multi-stage Production Build)

# ---- Stage 1: Build the React Application ----
# Use an official Node.js image as a "builder" environment.
FROM node:18-alpine AS builder

# Set the working directory inside the build container.
WORKDIR /app

# Copy package files and install dependencies.
# This leverages Docker's layer caching.
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the production-ready static files.
# The output will be in the /app/build directory.
RUN npm run build


# ---- Stage 2: Serve the Application with Nginx ----
# Use a lightweight, official Nginx image for the final production image.
FROM nginx:1.27-alpine

# Copy the built static files from the 'builder' stage into the Nginx public HTML directory.
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom Nginx configuration to replace the default one.
# This file tells Nginx how to serve our app and proxy API calls.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the Docker network.
EXPOSE 80

# The default command for the nginx image will automatically start the server.