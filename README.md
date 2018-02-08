#OPTIMIAM
Dockerized web application base on nodejs, used to store our home food receipts,
hosted on a RaspberryPi @ home.

## Prerequisites :
 - Docker
 - A Mysql server

## Build :
./docker_build.sh

## Run :
docker run --rm --name optimiam --hostname optimiam --link mysql:mysql -ti epicblox/optimiam

Access with http://optimiam/ in web browser.

## Plans :
 - host css and js instead using CNDs
 - sqli database capabilities (lighter for home usage, no other server dependance)
 - auth for add/modify/delete pages