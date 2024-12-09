# Use the latest Node.js version with a Debian-based image for the build stage
FROM node:20-bullseye AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker's caching mechanism for dependencies
COPY package.json ./

# Install dependencies, including devDependencies, to prepare for the build
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Use the latest Node.js slim image for the production stage to minimize size
FROM node:20-slim AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the built production files and required artifacts from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
