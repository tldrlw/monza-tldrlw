FROM node:20-alpine AS builder

# Accept the build argument
ARG BUILD_TIME
ARG IMAGE
ARG COGNITO_USER_POOL_ID
ARG COGNITO_USER_POOL_CLIENT_ID

# Set the environment variable inside the container (optional)
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME
ENV NEXT_PUBLIC_IMAGE=$IMAGE
ENV NEXT_PUBLIC_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
ENV NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=$COGNITO_USER_POOL_CLIENT_ID

# Print the build arguments (optional, for debugging)
RUN echo "Build time: $BUILD_TIME"
RUN echo "Image tag: $IMAGE"
RUN echo "Cognito User Pool ID: $COGNITO_USER_POOL_ID"
RUN echo "Cognito User Pool Client ID: $COGNITO_USER_POOL_CLIENT_ID"

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

FROM node:20-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the build output and node_modules from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/public ./public
# ^ don't have images yet...
COPY --from=builder /app/package*.json ./

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the Next.js app (by default it'll run on port 3000)
CMD ["npm", "start"]
# command to run the Next.js app on port 3001, for this to work need to `EXPOSE 3001`
# CMD ["npm", "start", "--", "-p", "3001"]

# Docker commands:
# docker build -t my-nextjs-app .
# Alternatively, you can run the Docker container and map the internal port 3000 to an external port 3001 without changing the Dockerfile:
# docker run -p 3001:3000 my-nextjs-app
# below is for when this Dockerfile exposes the port on 3001, instead of 3000 which is the default (also need to set CMD to what is commented on line 36)
# docker run -p 3001:3001 my-nextjs-app
