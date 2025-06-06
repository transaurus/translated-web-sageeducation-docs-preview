# Docker Compose セットアップ

Docker Composeを使用すると、マルチコンテナのDockerアプリケーションの管理が簡素化されます。

Dockerがインストールされていない場合は、[Dockerインストールチュートリアル](docs/tutorials/docker-install.md)をご覧ください。

Docker Composeには追加パッケージ`docker-compose-v2`が必要です。

**警告:** 古いDocker Composeのチュートリアルでは、`docker-compose build`のようなバージョン1の構文が参照されている場合があります。必ず、`docker compose build`（ハイフンではなくスペース）のようなバージョン2の構文を使用してください。

## `docker-compose.yml`の例

以下は、Docker ComposeでSage WebUIをセットアップするための設定ファイルの例です：

```yaml
version: '3'
services:
  openwebui:
    image: ghcr.io/Startr/AI-WEB-openwebui:main
    ports:
      - "3000:8080"
    volumes:
      - sage-open-webui:/app/backend/data
volumes:
  sage-open-webui:
```

## サービスの開始

サービスを開始するには、次のコマンドを実行します：

```bash
docker compose up -d
```

## ヘルパースクリプト

コードベースには`run-compose.sh`という便利なヘルパースクリプトが含まれています。このスクリプトは、デプロイに含めるDocker Composeファイルを選択するのに役立ち、セットアッププロセスを効率化します。

---

**注:** Nvidia GPUサポートが必要な場合、イメージを`ghcr.io/sage-open-webui/sage-open-webui:main`から`ghcr.io/sage-open-webui/sage-open-webui:cuda`に変更し、`docker-compose.yml`ファイルのサービス定義に以下を追加します：

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

この設定により、利用可能な場合にアプリケーションがGPUリソースを活用できるようになります。