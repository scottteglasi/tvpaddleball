#!/bin/bash
cd /opt/server && nodejs index.js &
nginx -g "daemon off;"

