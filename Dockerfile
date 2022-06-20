##
## Build
##
FROM node:lts-alpine as builder
LABEL Pedro Sanders <psanders@fonoster.com>

COPY . /build
WORKDIR /build

RUN npm install && npm run build && npm pack

##
## Runner
##
FROM node:lts-alpine as runner

COPY --from=builder /build/namegame*.tgz ./
RUN npm install -g namegame*.tgz

ENTRYPOINT ["sh", "-c"]
CMD [ "namegame" ]