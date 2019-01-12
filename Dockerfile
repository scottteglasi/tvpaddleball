FROM nginx

# Add custom config
COPY container-config/etc/nginx/conf.d/* /etc/nginx/conf.d

# Copy resources into place
COPY public /usr/share/nginx/html
COPY server /opt/server
COPY container-config/run.sh /run.sh

# Execute a build for each where necessary
RUN chmod +x /run.sh \
&& apt-get update && apt-get install -y curl gnupg && curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs \
# && apt-get update && apt-get install -y nodejs npm \
&& cd /opt/server && npm install && cd /usr/share/nginx/html/gameboard && npm install && cd /usr/share/nginx/html/controller && npm install

# Start node server on container startup
# Modify CMD here when the server is available
EXPOSE 3000
CMD ["/run.sh"]

