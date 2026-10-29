
FROM ubuntu:22.04

# Update package lists and install required tools
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    bash

# Download NodeSource setup script
RUN curl -fsSL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh

# Configure NodeSource repository
RUN bash /tmp/nodesource_setup.sh

# Install Node.js
RUN apt-get install -y nodejs

# Verify installations
RUN node --version && npm --version

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install application dependencies if package.json exists
RUN if [ -f package.json ]; then npm install; fi

# Default command
CMD ["bash"]
