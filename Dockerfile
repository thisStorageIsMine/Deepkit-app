FROM node:20.10.0-alpine
WORKDIR /home/app
COPY . .
RUN apk update && apk add build-base && apk add npm
RUN npm install
CMD npm run start
# cr.yandex/crpk59b52o09sjre05cp/kurs