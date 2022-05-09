FROM 10.217.2.231:8888/pangoo/base-vue:1.1

MAINTAINER pengtao Tao.Peng@desay-svautomotive.com

COPY ./dist /usr/share/nginx/html

ARG gateway_ip_port

RUN sed -i "s/GATEWAY_IP_PORT/$gateway_ip_port/g" /etc/nginx/conf.d/vue.conf
