FROM node:14
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]





# FROM node:14 as builder
# # ENV NODE_ENV=production
# WORKDIR /app
# COPY . .
# RUN npm i
# RUN npm run build

# FROM node:alpine as Runner
# WORKDIR /app
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001
# RUN chown -R nextjs:nodejs /app/.next
# USER nextjs
# EXPOSE 3000
# CMD ["npm", "start"]
