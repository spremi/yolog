#!/bin/sh
#
# yo!log    [Startup script]
#

# Exit immediately on failure
set -e

# Base directory for temporary files created by nginx.
mkdir -p /tmp/nginx

# Start supervisord with all arguments passed.
# Replace current process (Don't spawn a child) i.e. keep same PID.
exec "$@"
