---
sidebar_position: 2
title: "Brave"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage Open WebUIチームによってサポートされていません。特定のユースケース向けにSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したいですか？コントリビューションガイドをチェックしてください。
:::

## Brave API

### Docker Compose セットアップ

以下の環境変数をSage Open WebUIの`docker-compose.yaml`ファイルに追加してください：

```yaml
services:
  sage-open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "brave"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```