# Stage 1: Build Stage
FROM denoland/deno:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the application code to the working directory
COPY . .

# Build the application into a single executable
RUN deno compile --allow-net --allow-read --allow-env --allow-write --output app ./main.ts

# Stage 2: Minimal Runtime Stage
FROM debian:bullseye-slim

# Set a minimal working directory
WORKDIR /app

# Copy the executable from the builder stage
COPY --from=builder /app/app .

# Expose the necessary port (adjust as needed)
EXPOSE 3000

# Run the application
CMD ["./app"]
