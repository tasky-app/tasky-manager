FROM node:18-alpine
WORKDIR /app

VOLUME /tmp
RUN apk add jq
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        awscli \
    && rm -rf /var/cache/apk/*

RUN aws --version

COPY package*.json ./
COPY node_modules/ ./node_modules
COPY dist ./build/
COPY static ./static/
COPY docker/run.sh ./
COPY tsconfig.json ./

CMD ["npm run start:prod"]