FROM  node:latest

WORKDIR /app
COPY . /app

ENTRYPOINT [ "node ./bin/www" ]