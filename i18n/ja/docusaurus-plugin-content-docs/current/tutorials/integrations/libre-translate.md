---
sidebar_position: 25
title: "🔠 LibreTranslate Integration"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、OpenWebUIチームによるサポートはありません。特定のユースケース向けにOpenWebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをご確認ください。
:::

概要
--------

LibreTranslateは、幅広い言語をサポートする無料のオープンソース機械翻訳APIです。LibreTranslateはセルフホスティング可能で、オフライン動作が可能、簡単にセットアップできます。他のAPIとは異なり、GoogleやAzureなどのプロプライエタリなプロバイダーに依存せず、オープンソースの[Argos Translate](https://github.com/argosopentech/argos-translate)ライブラリを翻訳エンジンとして使用しています。LibreTranslateをSage Open WebUIと統合することで、その機械翻訳機能を活用できます。このドキュメントでは、DockerでLibreTranslateをセットアップし、Sage Open WebUI内で統合を設定する手順を段階的に説明します。

DockerでのLibreTranslateセットアップ
-----------------------------------

DockerでLibreTranslateをセットアップするには、以下の手順に従ってください：

### ステップ1: Docker Composeファイルの作成

任意のディレクトリに`docker-compose.yml`という名前の新しいファイルを作成します。ファイルに以下の設定を追加してください：

```yml
services:
  libretranslate:
    container_name: libretranslate
    image: libretranslate/libretranslate:v1.6.0
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file:
      - stack.env
    volumes:
      - libretranslate_api_keys:/app/db
      - libretranslate_models:/home/libretranslate/.local:rw
    tty: true
    stdin_open: true
    healthcheck:
      test: ['CMD-SHELL', './venv/bin/python scripts/healthcheck.py']
      
volumes:
  libretranslate_models:
  libretranslate_api_keys:
```

### ステップ2: `stack.env`ファイルの作成

`docker-compose.yml`ファイルと同じディレクトリに`stack.env`という名前の新しいファイルを作成します。ファイルに以下の設定を追加してください：

```bash
# LibreTranslate
LT_DEBUG="false"
LT_UPDATE_MODELS="true"
LT_SSL="false"
LT_SUGGESTIONS="false"
LT_METRICS="false"
LT_HOST="0.0.0.0"

LT_API_KEYS="false"

LT_THREADS="12"
LT_FRONTEND_TIMEOUT="2000"
```

### ステップ3: Docker Composeファイルの実行

以下のコマンドを実行してLibreTranslateサービスを起動します：

```bash
docker-compose up -d
```

これにより、LibreTranslateサービスがデタッチモードで起動します。

Sage Open WebUIでの統合設定
-------------------------------------------

DockerでLibreTranslateが起動したら、Sage Open WebUI内で統合を設定できます。利用可能なコミュニティ統合には以下があります：

* [LibreTranslateフィルター関数](https://openwebui.com/f/iamg30/libretranslate_filter)
* [LibreTranslateアクション関数](https://openwebui.com/f/jthesse/libretranslate_action)
* [多言語LibreTranslateアクション関数](https://openwebui.com/f/iamg30/multilanguage_libretranslate_action)
* [LibreTranslateフィルターパイプライン](https://github.com/sage-open-webui/pipelines/blob/main/examples/filters/libretranslate_filter_pipeline.py)

ニーズに最適な統合を選択し、Sage Open WebUI内で設定する手順に従ってください。

LibreTranslateパイプライン＆関数でサポートされる言語：
LibreTranslate内で見つかるすべての言語ですが、以下にリストを示します：

```
Albanian, Arabic, Azerbaijani, Bengali, Bulgarian, Catalan, Valencian, Chinese, Czech, Danish, Dutch, English, Flemish, Esperanto, Estonian, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Irish, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Persian, Polish, Portuguese, Romanian, Moldavian, Moldovan, Russian, Slovak, Slovenian, Spanish, Castilian, Swedish, Tagalog, Thai, Turkish, Ukrainian, Urdu
```

トラブルシューティング
--------------

* LibreTranslateサービスが実行中でアクセス可能であることを確認してください。
* Docker設定が正しいことを確認してください。
* LibreTranslateのログでエラーがないか確認してください。

統合の利点
----------------------

LibreTranslateをSage Open WebUIと統合することで、以下のような利点があります：

* 幅広い言語の機械翻訳機能
* テキスト分析と処理の改善
* 言語関連タスクの機能強化

結論
----------

LibreTranslateをSage Open WebUIと統合するプロセスはシンプルで、Sage Open WebUIインスタンスの機能を強化できます。このドキュメントで説明した手順に従うことで、DockerでLibreTranslateをセットアップし、Sage Open WebUI内で統合を設定できます。