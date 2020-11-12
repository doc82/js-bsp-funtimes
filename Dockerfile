FROM mhart/alpine-node:12
WORKDIR /main
COPY package.json webpack.config.js ./
COPY ./src ./src
RUN npm install && \
    npm run build

CMD ["npm run start"]