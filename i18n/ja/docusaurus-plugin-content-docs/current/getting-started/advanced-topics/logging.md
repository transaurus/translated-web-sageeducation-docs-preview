---
sidebar_position: 5
title: "📜 Sage WebUI Logging"
---

## ブラウザクライアントログ ##

クライアント側のログは一般的に[JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/console/log_static)の`console.log()`を通じて記録され、ブラウザ固有の開発者ツールを使用して確認できます:

* Blink
  * [Chrome/Chromium](https://developer.chrome.com/docs/devtools/)
  * [Edge](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/overview)
* Gecko
  * [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/)
* WebKit
  * [Safari](https://developer.apple.com/safari/tools/)

## アプリケーションサーバー/バックエンドログ ##

ログ機能は現在開発中ですが、環境変数を使用してある程度の制御が可能です。[Python Logging](https://docs.python.org/3/howto/logging.html)の`log()`と`print()`ステートメントは情報をコンソールに出力します。デフォルトのログレベルは`INFO`です。理想的には、機密データは`DEBUG`レベルでのみ表示されるべきです。

### ログレベル ###

以下の[ログレベル](https://docs.python.org/3/howto/logging.html#logging-levels)がサポートされています:

| Level      | Numeric value |
| ---------- | ------------- |
| `CRITICAL` | 50            |
| `ERROR`    | 40            |
| `WARNING`  | 30            |
| `INFO`     | 20            |
| `DEBUG`    | 10            |
| `NOTSET`   | 0             |

### グローバル ###

デフォルトのグローバルログレベル`INFO`は、`GLOBAL_LOG_LEVEL`環境変数で上書き可能です。設定すると、`config.py`内で`force`引数を*True*に設定した[basicConfig](https://docs.python.org/3/library/logging.html#logging.basicConfig)ステートメントが実行され、すべてのアタッチされたロガーが再設定されます:

> *このキーワード引数がtrueとして指定されている場合、他の引数で指定された構成を実行する前に、ルートロガーにアタッチされている既存のハンドラが削除され、閉じられます。*

ストリームは標準出力(`sys.stdout`)を使用します。sage-open-webuiのすべての`log()`ステートメントに加え、[urllib](https://docs.python.org/3/library/urllib.html)など、Python Loggingモジュールの`basicConfig`メカニズムを使用するインポートされたPythonモジュールにも影響を与えます。

例えば、Dockerパラメータとして`DEBUG`ログレベルを設定するには以下を使用します:

```
--env GLOBAL_LOG_LEVEL="DEBUG"
```

またはDocker Composeの場合、docker-compose.ymlファイルのenvironmentセクションに以下を記述します（引用符がないことに注意）:

```
environment:
  - GLOBAL_LOG_LEVEL=DEBUG
```

### アプリ/バックエンド ###

以下の変数の組み合わせを使用することで、ある程度の細かい制御が可能です。現在`basicConfig`の`force`は使用されていないため、これらのステートメントはsage-open-webuiのログにのみ影響し、サードパーティモジュールには影響しない可能性があることに注意してください。

| Environment Variable | App/Backend                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `AUDIO_LOG_LEVEL`    | Audio transcription using faster-whisper, TTS etc.                |
| `COMFYUI_LOG_LEVEL`  | ComfyUI integration handling                                      |
| `CONFIG_LOG_LEVEL`   | Configuration handling                                            |
| `DB_LOG_LEVEL`       | Internal Peewee Database                                          |
| `IMAGES_LOG_LEVEL`   | AUTOMATIC1111 stable diffusion image generation                   |
| `MAIN_LOG_LEVEL`     | Main (root) execution                                             |
| `MODELS_LOG_LEVEL`   | LLM model interaction, authentication, etc.                       |
| `OLLAMA_LOG_LEVEL`   | Ollama backend interaction                                        |
| `OPENAI_LOG_LEVEL`   | OpenAI interaction                                                |
| `RAG_LOG_LEVEL`      | Retrieval-Augmented Generation using Chroma/Sentence-Transformers |
| `WEBHOOK_LOG_LEVEL`  | Authentication webhook extended logging                           |