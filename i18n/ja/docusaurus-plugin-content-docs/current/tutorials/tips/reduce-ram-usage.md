---
sidebar_position: 10
title: "✂️ Reduce RAM Usage"
---

# RAM使用量の削減

このイメージをRAMが制限された環境でデプロイする場合、イメージをスリム化するためにいくつかの方法があります。

Raspberry Pi 4（arm64）でバージョンv0.3.10を使用した場合、アイドル時のメモリ消費量を>1GBから~200MBに削減できました（`docker container stats`で観測）。

## 概要

以下の環境変数（または既存のデプロイメントの場合はそれぞれのUI設定）を設定します：`RAG_EMBEDDING_ENGINE: ollama`、`AUDIO_STT_ENGINE: openai`。

## 詳細な説明

メモリ消費の大部分は、ロードされたMLモデルによるものです。外部の言語モデル（OpenAIまたはアンバンドルされたollama）を使用している場合でも、追加目的で多くのモデルがロードされる可能性があります。

v0.3.10時点では以下が含まれます：

* 音声認識（デフォルトはwhisper）
* RAG埋め込みエンジン（デフォルトはローカルのSentenceTransformersモデル）
* 画像生成エンジン（デフォルトでは無効）

最初の2つはデフォルトで有効かつローカルモデルに設定されています。これらのモデルは管理パネルで変更できます（RAG: DocumentsカテゴリでOllamaまたはOpenAIに設定、音声認識: AudioセクションでOpenAIまたはWebAPIを使用）。
新しいDockerイメージをデプロイする場合は、以下の環境変数で設定することもできます：`RAG_EMBEDDING_ENGINE: ollama`、`AUDIO_STT_ENGINE: openai`。ただし、これらの環境変数は`config.json`が既に存在する場合には効果がありません。