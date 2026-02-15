#
# yo!log
#

##
## Stage 1: Angular build
##
FROM node:20-bookworm AS ui-build

WORKDIR /ui

# Install dependencies
COPY ui/package*.json ./
RUN npm install

# Copy sources
COPY ui/ .

# Copy Build
RUN npm run build -- --configuration production


##
## Stage 2: Runtime (Python + Nginx)
##
FROM python:3.12-bookworm

# Install system dependencies
RUN apt-get update && \
    apt-get install -y nginx supervisor gettext-base && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -g 1000 appuser && useradd -r -g appuser -u 1000 appuser

#
# Deploy server component
#

# Ensure virtual environment is created in project directory
ENV PIPENV_VENV_IN_PROJECT=1

WORKDIR /app/server

# Install pipenv
RUN pip install --no-cache-dir pipenv

# Copy Pipfile
COPY server/Pipfile         ./Pipfile
COPY server/Pipfile.lock    ./Pipfile.lock

# Install dependencies
RUN pipenv install --deploy --ignore-pipfile

# Copy server sources
COPY server/adapters/       ./adapters/
COPY server/models/         ./models/
COPY server/protocol/       ./protocol/
COPY server/routes/         ./routes/
COPY server/main.py         ./main.py
COPY server/state.py        ./state.py

#
# Deploy UI component
#

# Copy Angular application
COPY --from=ui-build /ui/dist/yo-log/browser /app/ui

#
# Finalize system configuration
#

# Replace default nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Create 'system' directory for normal user
RUN mkdir -p /app/system

# Add supervisord to start nginx and uvicorn servers
COPY docker/supervisor/supervisord.conf    /app/system/supervisord.conf

# Add startup script for container
COPY docker/entrypoint.sh       /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Update permissions before running as 'appuser'
RUN chown -R appuser:appuser /app /var/log/nginx /var/lib/nginx

# Switch to normal user
USER appuser

# Expose ports (env-driven)
EXPOSE 4200 8000 4317 4318

ENTRYPOINT ["/entrypoint.sh"]

# CMD ["/usr/bin/supervisord", "-n"]
CMD ["/usr/bin/supervisord", "-c", "/app/system/supervisord.conf", "-n"]