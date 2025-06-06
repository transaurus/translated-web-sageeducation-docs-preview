## アップデート方法

ローカルのDockerインストールを最新バージョンに更新するには、**Watchtower**を使用するか、手動でコンテナを更新します。

### オプション1: Watchtowerを使用

[Watchtower](https://containrrr.dev/watchtower/)を使用すると、更新プロセスを自動化できます:

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once sage-open-webui
```

_(コンテナ名が異なる場合は、`sage-open-webui`をあなたのコンテナ名に置き換えてください。)_

### オプション2: 手動更新

1. 現在のコンテナを停止して削除:

   ```bash
   docker rm -f sage-open-webui
   ```

2. 最新バージョンをプル:

   ```bash
   docker pull ghcr.io/Startr/AI-WEB-openwebui:main
   ```

3. コンテナを再起動:

   ```bash
   docker run -d -p 3000:8080 -v sage-open-webui:/app/backend/data --name sage-open-webui ghcr.io/Startr/AI-WEB-openwebui:main
   ```

どちらの方法でも、Dockerインスタンスを最新ビルドに更新して実行できます。