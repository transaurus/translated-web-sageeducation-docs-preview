---
sidebar_position: 2
title: "🔧 Pipes"
---

# パイプ

パイプは、LLMのメッセージをユーザーに返す前に実行できる関数です。パイプで実行可能なアクションの例としては、Retrieval Augmented Generation（RAG）の実行、AnthropicやAzure OpenAI、Googleなどの非OpenAI LLMプロバイダーへのリクエスト送信、Web UI内での関数実行などがあります。パイプはFunctionとして、またはPipelinesサーバー上でホストできます。使用例の一覧は[Pipelinesリポジトリ](https://github.com/Startr/pipelines/tree/main/examples/pipelines)で管理されています。一般的なワークフローは下記の画像で確認できます。

<p align="center">
  <a href="#">
    <img src="/images/pipelines/pipes.png" alt="Pipe Workflow" />
  </a>
</p>

WebUIで定義されたパイプは、「External」の指定が付いた新しいモデルとして表示されます。2つのパイプモデル（`Database RAG Pipeline`と`DOOM`）の例を、以下の2つのモデルの横に示します：

<p align="center">
  <a href="#">
    <img src="/images/pipelines/pipe-model-example.png" alt="Pipe Models in WebUI" />
  </a>
</p>