# Multi-stage Dockerfile for iStampit hybrid deployment
# Stage 1: build web app & install CLI
FROM node:20-bullseye AS build
WORKDIR /app

# Install Python + build tools for istampit-cli (if Python CLI needed inside container)
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip python3-venv git ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy root manifests
COPY package.json package-lock.json ./
# Copy workspaces and submodules
COPY istampit-web/package.json istampit-web/package.json
COPY istampit-action ./istampit-action
COPY istampit-cli ./istampit-cli
COPY istampit-web ./istampit-web

# Install deps (root)
RUN npm install --no-audit --no-fund

# (Optional) Install CLI via pip if not already provided another way
RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    cd istampit-cli && python3 -m pip install .

# Build web (Next.js) - hybrid (no export)
WORKDIR /app/istampit-web
ENV NODE_ENV=production
RUN npm run build

# Stage 2: runtime
FROM node:20-bullseye AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and node_modules from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/istampit-web ./istampit-web
# (Optional) Copy Python environment if needed for CLI
COPY --from=build /usr/local/lib/python3.*/ /usr/local/lib/python3.11/
COPY --from=build /usr/local/bin/istampit /usr/local/bin/istampit

EXPOSE 3000

WORKDIR /app/istampit-web
CMD ["npx", "next", "start", "-p", "3000"]
