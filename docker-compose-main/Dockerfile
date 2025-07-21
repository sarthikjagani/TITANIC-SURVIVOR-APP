# Use an official Node.js image, matching your GitLab CI file for consistency
#
# Documentation: https://hub.docker.com/_/node
FROM node:18-alpine

# Set the working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# We copy these first to take advantage of Docker's layer caching.
# The npm install step will only be re-run if these files change.
COPY package.json package-lock.json ./

# Install project dependencies
#
# Documentation: https://docs.npmjs.com/cli/v10/commands/npm-install
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# The react-scripts start command runs on port 3000 by default.
# This line makes the container listen on that port.
EXPOSE 3000

# The command to start the application's development server
#
# Documentation: https://create-react-app.dev/docs/available-scripts#npm-start
CMD ["npm", "start"]