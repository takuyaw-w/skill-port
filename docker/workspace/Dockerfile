FROM node:24-bookworm-slim

ARG PNPM_VERSION=11.0.0

ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NPM_CONFIG_STORE_DIR="/home/node/.local/share/pnpm/store"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /workspace

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    git \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p \
    /home/node/.local/share/pnpm/store \
    /workspace/node_modules \
    /workspace/apps/api/node_modules \
  && chown -R node:node \
    /home/node/.local \
    /workspace/node_modules \
    /workspace/apps/api/node_modules

# /usr/local/bin/pnpm などの symlink 作成は root で行う
RUN corepack enable

USER node

# pnpm 本体は node ユーザーの Corepack cache に用意する
RUN corepack prepare "pnpm@${PNPM_VERSION}" --activate

CMD ["sleep", "infinity"]
