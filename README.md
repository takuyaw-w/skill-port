# skill-port

SES企業向けのスキルシート管理アプリです。

## 構成

```txt
apps/
  api/            Hono API
  admin-web/      管理者向け Nuxt app
  employee-web/   従業員向け Nuxt app

packages/
  shared/         共通定数・ラベル・union型
  contracts/      API request / response / error 型
```

## 前提条件

- Docker
- Docker Compose
- VS Code Remote Containers または Dev Containers 相当の開発環境
- Node.js はコンテナ内で利用する

このリポジトリでは、依存関係は基本的にコンテナ内で管理します。

## 初回セットアップ

### 1. コンテナを起動

```bash
docker compose up -d
```

### 2. workspace コンテナに入る

```bash
docker compose exec workspace bash
```

### 3. 依存関係をインストール

```bash
pnpm install
```

### 4. DB migration を実行

```bash
pnpm api:db:migrate
```

### 5. seed を実行

```bash
pnpm api:db:seed
```

## 開発サーバー起動

### API

```bash
pnpm api:dev
```

URL:

```txt
http://localhost:8787
```

### 管理者向け Web

```bash
pnpm admin-web:dev
```

URL:

```txt
http://localhost:3001
```

### 従業員向け Web

```bash
pnpm employee-web:dev
```

URL:

```txt
http://localhost:3002
```

## よく使うコマンド

### 型チェック

```bash
pnpm run typecheck
```

### API テスト

```bash
pnpm api:test
```

### Lint

```bash
pnpm run lint
```

### Drizzle migration 生成

```bash
pnpm api:db:generate
```

### Drizzle migration 適用

```bash
pnpm api:db:migrate
```

### Drizzle Studio

```bash
pnpm api:db:studio
```

## DB を作り直す

DB、node_modules volume、pnpm store などを含めて完全に作り直す場合は、以下を実行します。

```bash
docker compose down -v --remove-orphans
docker compose build --no-cache
docker compose up -d
docker compose exec workspace pnpm install
docker compose exec workspace pnpm api:db:migrate
docker compose exec workspace pnpm api:db:seed
```

## node_modules をホストに作らない方針

このプロジェクトでは、ホスト側に `node_modules` を直接作らない方針です。

`compose.yml` では、各 workspace package の `node_modules` と pnpm store を Docker volume に逃がしています。

## DB 接続情報

開発環境では Docker Compose 内の PostgreSQL を使用します。

```txt
host: db
port: 5432
database: app
user: app
password: password
```

workspace からは以下の `DATABASE_URL` を使用します。

```txt
postgres://app:password@db:5432/app
```

## トラブルシュート

### migration が止まる / 失敗する

まず DB 接続情報を確認します。

```bash
docker compose exec workspace printenv DATABASE_URL
```

期待値:

```txt
postgres://app:password@db:5432/app
```

DB に接続できるか確認します。

```bash
docker compose exec db psql -U app -d app -c 'select current_database(), current_user;'
```

### DB 初期化 SQL を変更したのに反映されない

`docker/postgres/init.sql` は、DB volume 初回作成時にのみ実行されます。

反映したい場合は DB volume を削除して作り直します。

```bash
docker compose down -v --remove-orphans
docker compose up -d
```

### pnpm の依存関係がおかしい

依存関係 volume を含めて作り直します。

```bash
docker compose down -v --remove-orphans
docker compose build --no-cache
docker compose up -d
docker compose exec workspace pnpm install
```
