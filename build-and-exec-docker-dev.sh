docker build -t micro-parse-dev-docker -f Dockerfile.development .
docker run -p 49160:8080 -d micro-parse-dev-docker

