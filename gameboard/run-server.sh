#!/bin/bash
docker build -t paddleboard-gameboard .
docker run -d -v "$PWD":/var/www/html -p 80:80 paddleboard-gameboard:latest
