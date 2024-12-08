# Use an official Node.js image as the base for building
FROM node:18-bullseye AS builder

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install npm-force-resolutions to enforce dependency overrides
RUN npm install npm-force-resolutions

# Add a "resolutions" field dynamically to enforce the desired cross-spawn version
RUN echo '{ "resolutions": { "cross-spawn": "7.0.5" } }' >./package-overrides.json &&
  jq -s '.[0] * .[1]' package.json package-overrides.json >package.temp.json &&
  mv package.temp.json package.json

# Apply resolutions and install dependencies
RUN npx npm-force-resolutions && npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a slim Node.js image for the final production stage
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /app

# Copy production dependencies and build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set the environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
