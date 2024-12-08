# Use an official Node.js image as the base
FROM node:18-bullseye AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Add a "resolutions" field to enforce dependency versions
RUN npm install npm-force-resolutions

# Apply resolutions to enforce specific versions of transitive dependencies
RUN npx npm-force-resolutions && npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production

# Use a slim image for the final stage
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]