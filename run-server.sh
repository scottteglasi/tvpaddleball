#!/bin/bash
docker build -t tvpaddleboard .
docker run \
--name tvpaddleboard \
-d \
-v "$PWD"/container-config/etc/nginx/conf.d:/etc/nginx/conf.d \
-v "$PWD"/public:/usr/share/nginx/html \
-p 8080:80 \
tvpaddleboard:latest
