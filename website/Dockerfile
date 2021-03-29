FROM node:14
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
