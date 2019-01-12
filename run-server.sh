#!/bin/bash
docker build -t tvpaddleboard .
docker run \
--name tvpaddleboard \
-d \
-v "$PWD"/container-config/etc/nginx/conf.d:/etc/nginx/conf.d \
-v "$PWD"/public:/usr/share/nginx/html \
-v "$PWD"/server:/opt/server \
-p 8080:80 \
-p 3000:3000 \
tvpaddleboard:latest
