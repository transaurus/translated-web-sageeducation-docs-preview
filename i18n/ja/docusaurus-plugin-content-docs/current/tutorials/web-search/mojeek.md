---
sidebar_position: 8
title: "Mojeek"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケースに合わせてSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿チュートリアルをご確認ください。
:::

## Mojeek Search API

### セットアップ

1. [Mojeek Search APIページ](https://www.mojeek.com/services/search/web-search-api/)にアクセスし、`APIキー`を取得してください
2. `APIキー`を取得後、`Sage Open WebUI管理パネル`を開き、`Settings`タブをクリックしてから`Web Search`を選択します
3. `Web検索`を有効にし、`Web検索エンジン`を`mojeek`に設定します
4. `Mojeek Search APIキー`欄に取得した`APIキー`を入力します
5. `保存`をクリックします

### Docker Compose設定

Sage Open WebUIの`docker-compose.yaml`ファイルに以下の環境変数を追加してください：

```yaml
services:
  sage-open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "mojeek"
      BRAVE_SEARCH_API_KEY: "YOUR_MOJEEK_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```