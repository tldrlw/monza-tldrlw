# Use the latest Node.js version for building
FROM node:20-bullseye AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use the latest slim Node.js image for production
FROM node:20-slim AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy production dependencies and build output from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set the environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]