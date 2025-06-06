---
sidebar_position: 30
title: "🔗 Redis Websocket Support"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによるサポート対象外です。特定のユースケース向けにSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？ 寄稿ガイドを確認してください。
:::

# 🔗 Redis WebSocketサポート

## 概要

このドキュメントでは、Sage WebUIでWebSocketサポートを有効化するためにRedisを統合する手順を説明します。これらの手順に従うことで、クライアントとアプリケーション間のリアルタイム通信と更新を可能にするWebSocket機能をSage WebUIインスタンスで利用できるようになります。

### 前提条件

* 有効なSage WebUIインスタンス（バージョン1.0以上が動作していること）
* Redisコンテナ（この例では`docker.io/valkey/valkey:8.0.1-alpine`を使用します。これは最新のRedis 7.xリリースに基づいています）
* システムにDocker Compose（バージョン2.0以上）がインストールされていること
* Sage WebUIとRedis間の通信用Dockerネットワーク
* Docker、Redis、Sage WebUIに関する基本的な理解

## Redisのセットアップ

WebSocketサポートのためにRedisをセットアップするには、以下の内容で`docker-compose.yml`ファイルを作成する必要があります：

```yml
version: '3.9'
services:
  redis:
    image: docker.io/valkey/valkey:8.0.1-alpine
    container_name: redis-valkey
    volumes:
      - redis-data:/data
    command: "valkey-server --save 30 1"
    healthcheck:
      test: "[ $$(valkey-cli ping) = 'PONG' ]"
      start_period: 5s
      interval: 1s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
      - DAC_OVERRIDE
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
    networks:
      - openwebui-network

volumes:
  redis-data:

networks:
  openwebui-network:
    external: true
```

:::info[注記]

この設定では`ports`ディレクティブが含まれていません。ほとんどのケースでは必要ないためです。RedisサービスはDockerネットワーク内からSage WebUIサービスによってアクセス可能です。ただし、デバッグや監視目的でDockerネットワーク外部からRedisインスタンスにアクセスする必要がある場合は、Redisポート（例：`6379:6379`）を公開するために`ports`ディレクティブを追加できます。

上記の設定では、`redis-valkey`という名前のRedisコンテナをセットアップし、データ永続化のためのボリュームをマウントしています。`healthcheck`ディレクティブは、`ping`コマンドに応答しない場合にコンテナを再起動することを保証します。`--save 30 1`コマンドオプションは、少なくとも1つのキーが変更された場合に30分ごとにRedisデータベースをディスクに保存します。

:::

Sage WebUIとRedis間の通信用Dockerネットワークを作成するには、次のコマンドを実行します：

```bash
docker network create openwebui-network
```

## Sage WebUIの設定

Sage WebUIでWebSocketサポートを有効化するには、Sage WebUIインスタンスに対して以下の環境変数を設定する必要があります：

```bash
ENABLE_WEBSOCKET_SUPPORT="true"
WEBSOCKET_MANAGER="redis"
WEBSOCKET_REDIS_URL="redis://redis:6379/1"
```

これらの環境変数はWebSocketサポートを有効にし、WebSocketマネージャーとしてRedisを指定し、Redis URLを定義します。`WEBSOCKET_REDIS_URL`の値は実際のRedisインスタンスのIPアドレスに置き換えてください。

Dockerを使用してSage WebUIを実行する場合、同じDockerネットワークに接続する必要があります：

```bash
docker run -d \
  --name sage-open-webui \
  --network openwebui-network \
  -v sage-open-webui:/app/backend/data \
  -e ENABLE_WEBSOCKET_SUPPORT="true" \
  -e WEBSOCKET_MANAGER="redis" \
  -e WEBSOCKET_REDIS_URL="redis://127.0.0.1:6379/1" \
  ghcr.io/Startr/AI-WEB-openwebui:main
```

Dockerネットワーク内のRedisコンテナの実際のIPアドレスで`127.0.0.1`を置き換えてください。

## 検証

RedisのセットアップとSage WebUIの設定が正しく行われていれば、Sage WebUIインスタンスを起動時に以下のログメッセージが表示されるはずです：

`DEBUG:open_webui.socket.main:Using Redis to manage websockets.`

これはSage WebUIがWebSocket管理にRedisを使用していることを確認します。また、`docker exec`コマンドを使用してRedisインスタンスが実行中で接続を受け付けていることを確認できます：

```bash
docker exec -it redis-valkey redis-cli -p 6379 ping
```

このコマンドは、Redisインスタンスが正しく実行されている場合に`PONG`を出力します。このコマンドが失敗する場合は、代わりに次のコマンドを試すことができます：

```bash
docker exec -it redis-valkey valkey-cli -p 6379 ping
```

## トラブルシューティング

RedisまたはSage WebUIのWebSocketサポートで問題が発生した場合は、以下のリソースを参照してトラブルシューティングを行ってください：

* [Redis ドキュメント](https://redis.io/docs)
* [Docker Compose ドキュメント](https://docs.docker.com/compose/overview/)
* [sysctl ドキュメント](https://man7.org/linux/man-pages/man8/sysctl.8.html)

これらの手順とトラブルシューティングのヒントに従うことで、Sage WebUIでRedisをセットアップし、WebSocketサポートを有効にし、クライアントとアプリケーション間のリアルタイム通信と更新を実現できるはずです。