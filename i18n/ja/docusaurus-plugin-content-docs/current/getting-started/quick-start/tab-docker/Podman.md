# Podmanの使用

Podmanは、OCIコンテナの開発、管理、実行を行うデーモンレスなコンテナエンジンです。

## 基本コマンド

- **コンテナの実行:**

  ```bash
  podman run -d --name openwebui -p 3000:8080 ghcr.io/Startr/AI-WEB-openwebui:main
  ```

- **実行中のコンテナ一覧表示:**

  ```bash
  podman ps
  ```

## Podmanでのネットワーク設定

ネットワークの問題が発生した場合、ネットワーク設定の調整が必要になることがあります:

```bash
--network=slirp4netns:allow_host_loopback=true
```

詳細な設定についてはPodmanの[ドキュメント](https://podman.io/)を参照してください。