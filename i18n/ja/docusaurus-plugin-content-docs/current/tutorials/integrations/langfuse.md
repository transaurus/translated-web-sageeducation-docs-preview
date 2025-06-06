---
sidebar_position: 20
title: "💥 Monitoring and Debugging with Langfuse"
---

# OpenWebUIとLangfuseの連携

[Langfuse](https://langfuse.com/) ([GitHub](https://github.com/langfuse/langfuse))は、OpenWebUI向けのオープンソースの可観測性および評価ツールを提供します。Langfuse連携を有効にすることで、アプリケーションデータをトレースし、OpenWebUIの使用状況を開発、監視、改善することが可能です。具体的には以下の機能が利用できます:

- アプリケーションの[トレース](https://langfuse.com/docs/tracing)
- 使用パターンの分析
- ユーザーとモデルごとのコストデータ
- セッションの再生による問題デバッグ
- [評価](https://langfuse.com/docs/scores/overview)

## OpenWebUIとLangfuseの連携方法

![Langfuse連携](https://langfuse.com/images/docs/openwebui-integration.gif)
_Langfuse連携手順_

OpenWebUIの[Pipelines](https://github.com/Startr/pipelines/)は、OpenAI APIプラグイン向けのUI非依存フレームワークです。ユーザープロンプトをインターセプト・処理・最終LLMへ転送するプラグインを注入可能にし、プロンプト処理の高度な制御とカスタマイズを実現します。

Langfuseでアプリケーションデータをトレースするには、[Langfuseパイプライン](https://github.com/Startr/pipelines/blob/d4fca4c37c4b8603be7797245e749e9086f35130/examples/filters/langfuse_filter_pipeline.py)を使用します。これによりメッセージ相互作用のリアルタイム監視と分析が可能になります。

## クイックスタートガイド

### ステップ1: OpenWebUIのセットアップ

OpenWebUIが動作していることを確認してください。セットアップ方法は[OpenWebUIドキュメント](/)を参照してください。

### ステップ2: Pipelinesのセットアップ

Dockerを使用して[Pipelines](https://github.com/Startr/pipelines/)を起動します。以下のコマンドでPipelinesを開始します:

```bash
docker run -p 9099:9099 --add-host=host.docker.internal:host-gateway -v pipelines:/app/pipelines --name pipelines --restart always ghcr.io/AI-WEB-openwebui/pipelines:main
```

### ステップ3: OpenWebUIとPipelinesの接続

_管理者設定_で、OpenAI APIタイプの新しい接続を作成し、以下の詳細を保存します:

- **URL:** http://host.docker.internal:9099 (事前に起動したDockerコンテナの実行場所)
- **パスワード:** 0p3n-w3bu! (標準パスワード)

![OpenWebUI設定](https://langfuse.com/images/docs/openwebui-setup-settings.png)

### ステップ4: Langfuseフィルターパイプラインの追加

次に、_管理者設定_ -> _Pipelines_に移動し、Langfuseフィルターパイプラインを追加します。Pipelinesがhttp://host.docker.internal:9099でリッスンしていることを指定し（前述の設定通り）、[Langfuseフィルターパイプライン](https://github.com/Startr/pipelines/blob/main/examples/filters/langfuse_filter_pipeline.py)を_GitHub URLからインストール_オプションを使用して以下のURLでインストールします:

```
https://github.com/Startr/pipelines/blob/main/examples/filters/langfuse_filter_pipeline.py
```

以下にLangfuse APIキーを追加してください。Langfuseにまだ登録していない場合は、[こちら](https://cloud.langfuse.com)でアカウントを作成してAPIキーを取得できます。

![OpenWebUI Langfuseパイプライン追加](https://langfuse.com//images/docs/openwebui-add-pipeline.png)

_**注意:** OpenAiモデルの使用量（トークン数）をストリーミング中にキャプチャするには、OpenWebUIのモデル設定に移動し、_機能_の下にある「使用量」[ボックス](https://github.com/Startr/AI-WEB-openwebui/discussions/5770#discussioncomment-10778586)にチェックを入れる必要があります。_

### ステップ5: Langfuseでトレースを確認

これでOpenWebUIアプリケーションと対話し、Langfuseでトレースを確認できるようになります。

Langfuse UIでの[トレース例](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/904a8c1f-4974-4f8f-8a2f-129ae78d99c5?observation=fe5b127b-e71c-45ab-8ee5-439d4c0edc28):

![LangfuseにおけるOpenWebUIトレース例](https://langfuse.com/images/docs/openwebui-example-trace.png)

## 詳細情報

OpenWebUI Pipelinesの包括的なガイドについては、[こちらの記事](https://ikasten.io/2024/06/03/getting-started-with-openwebui-pipelines/)をご覧ください。