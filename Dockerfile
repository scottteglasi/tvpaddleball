FROM nginx
# Add custom config
COPY container-config/etc/nginx/conf.d/* /etc/nginx/conf.d

# Copy resources into place
COPY public /usr/share/nginx/html
COPY server /opt/server

# Start node server on container startup
# Modify CMD here when the server is available
