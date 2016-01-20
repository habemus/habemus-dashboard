FROM nginx:1.9

MAINTAINER Simon Fan <simon.fan@habem.us>

# nginx configuration files
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# files to be served
COPY dist /data/www