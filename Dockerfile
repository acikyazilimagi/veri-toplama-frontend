# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
RUN npm i
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that serve uses)
EXPOSE 80
# Start the app
CMD [ "npx", "serve", "build" ]
