#
# 1) Build Stage
#
FROM node:18.20.1-alpine AS twenty-website-build

# Install bash (useful for debugging or running scripts)
RUN apk update && apk add bash

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json .
COPY ./yarn.lock .
COPY ./.yarnrc.yml .
COPY ./.yarn/releases /app/.yarn/releases
COPY ./tools/eslint-rules /app/tools/eslint-rules
COPY ./packages/twenty-website/package.json /app/packages/twenty-website/package.json

# Install dependencies
RUN yarn

# Environment variables for the build process
ENV KEYSTATIC_GITHUB_CLIENT_ID="<fake build value>"
ENV KEYSTATIC_GITHUB_CLIENT_SECRET="<fake build value>"
ENV KEYSTATIC_SECRET="<fake build value>"
ENV NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG="<fake build value>"

# Now copy the website source and build it
COPY ./packages/twenty-website /app/packages/twenty-website
RUN npx nx build twenty-website

#
# 2) Final Stage
#
FROM node:18.20.1-alpine AS twenty-website

# Install bash in the final image as well
RUN apk update && apk add bash

WORKDIR /app/packages/twenty-website

# Copy all built artifacts and node_modules from build stage
COPY --from=twenty-website-build /app /app

# Label metadata
LABEL org.opencontainers.image.source="https://github.com/twentyhq/twenty" \
      org.opencontainers.image.description="This image provides a consistent and reproducible environment for the website."

# Adjust ownership if your container needs non-root
RUN chown -R 1000 /app

# Use non-root user with UID 1000
USER 1000

# Launch the app
CMD ["/bin/sh", "-c", "npx nx start"]
