FROM node:lts-slim
COPY / /app-root
EXPOSE 4000
RUN groupadd doccano \ 
&& useradd -m -d /home/doccano -g doccano doccano \
&& chown -R doccano:doccano /app-root \
&& chmod +x /app-root/* \
&& ls -lha 
WORKDIR /app-root 
USER doccano
RUN npm run setup
ENTRYPOINT [ "npm", "start" ]