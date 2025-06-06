## Dockerでクイックスタート 🐳

以下の手順に従って、Sage WebUIをDockerでインストールします。

## ステップ1: Sage WebUIイメージの取得

GitHub Container Registryから最新のSage WebUI Dockerイメージを取得します。

```bash
docker pull ghcr.io/Startr/AI-WEB-openwebui:main
```

## ステップ2: コンテナの実行

デフォルト設定でコンテナを実行します。このコマンドには、データを永続化するためのボリュームマッピングが含まれています。

```bash
docker run -d -p 3000:8080 -v sage-open-webui:/app/backend/data --name sage-open-webui ghcr.io/Startr/AI-WEB-openwebui:main
```

### 重要なフラグ

- **ボリュームマッピング (`-v sage-open-webui:/app/backend/data`)**: データの永続的な保存を保証します。これにより、コンテナの再起動時にデータが失われるのを防ぎます。
- **ポートマッピング (`-p 3000:8080`)**: WebUIをローカルマシンのポート3000で公開します。

### GPUサポートの利用

Nvidia GPUサポートを利用するには、`docker run`コマンドに`--gpus all`を追加します：

```bash
docker run -d -p 3000:8080 --gpus all -v sage-open-webui:/app/backend/data --name sage-open-webui ghcr.io/Startr/AI-WEB-openwebui:cuda
```

#### シングルユーザーモード（ログイン無効化）

ログインページをバイパスしてシングルユーザー設定にするには、`WEBUI_AUTH`環境変数を`False`に設定します：

```bash
docker run -d -p 3000:8080 -e WEBUI_AUTH=False -v sage-open-webui:/app/backend/data --name sage-open-webui ghcr.io/Startr/AI-WEB-openwebui:main
```

:::warning
この変更後は、シングルユーザーモードとマルチアカウントモードを切り替えることはできません。
:::

#### 高度な設定: 別サーバーのOllamaに接続

別のホストにあるOllamaサーバーにSage WebUIを接続するには、`OLLAMA_BASE_URL`環境変数を追加します：

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v sage-open-webui:/app/backend/data --name sage-open-webui --restart always ghcr.io/Startr/AI-WEB-openwebui:main
```

## WebUIへのアクセス

コンテナが実行されたら、以下のURLでSage WebUIにアクセスできます：

[http://localhost:3000](http://localhost:3000)

各Dockerフラグの詳細なヘルプについては、[Dockerのドキュメント](https://docs.docker.com/engine/reference/commandline/run/)を参照してください。