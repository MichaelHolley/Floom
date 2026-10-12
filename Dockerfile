FROM node:24-slim AS build
WORKDIR /app
RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build && pnpm prune --prod

FROM node:24-slim
WORKDIR /app
# adapter-node rejects bodies over 512K by default; this must stay above MAX_PHOTO_BYTES
ENV NODE_ENV=production DATA_DIR=/data BODY_SIZE_LIMIT=26M
# the login rate limit needs the visitor's address, which only the reverse proxy knows
ENV ADDRESS_HEADER=X-Forwarded-For
RUN mkdir /data && chown node:node /data
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
USER node
EXPOSE 3000
VOLUME /data
CMD ["node", "build"]
