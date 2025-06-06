---
sidebar_position: 1
title: "🗨️ Edge TTS Using Docker"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとしてのみ提供されています。寄稿をご希望ですか？寄稿チュートリアルをご確認ください。
:::

# Sage WebUIと`openai-edge-tts` 🗣️の統合

## `openai-edge-tts`とは？

[OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts)は、OpenAI APIエンドポイントを模倣したテキスト読み上げAPIです。Sage WebUIのようにエンドポイントURLを定義できるシナリオで直接代替として使用できます。

このサービスは[edge-tts](https://github.com/rany2/edge-tts)パッケージを使用しており、Edgeブラウザの無料「音声読み上げ」機能を活用してMicrosoft/Azureへのリクエストをエミュレートし、無料で非常に高品質なテキスト読み上げを実現します。

[音声サンプルはこちら](https://tts.travisvn.com)

<details>
  <summary>How is it different from 'openedai-speech'?</summary>

Similar to [openedai-speech](https://github.com/matatonic/openedai-speech), [openai-edge-tts](https://github.com/travisvn/openai-edge-tts) is a text-to-speech API endpoint that mimics the OpenAI API endpoint, allowing for a direct substitute in scenarios where the OpenAI Speech endpoint is callable and the server endpoint URL can be configured.

`openedai-speech` is a more comprehensive option that allows for entirely offline generation of speech with many modalities to choose from.

`openai-edge-tts` is a simpler option that uses a Python package called `edge-tts` to generate the audio.

</details>

## 要件

- システムにDockerがインストールされていること
- Sage WebUIが動作していること

## ⚡️ クイックスタート

何も設定せずに最も簡単に始める方法は、以下のコマンドを実行することです

```bash
docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest
```

これにより、デフォルト設定でポート5050でサービスが実行されます

## Sage WebUIで`openai-edge-tts`を使用する設定

- 管理パネルを開き、`設定` -> `音声`に移動します
- TTS設定を以下のスクリーンショットと一致するように設定します
- _注：ここでTTS音声を指定できます_

![このプロジェクト用の正しいエンドポイントを追加したSage WebUI管理画面の音声設定スクリーンショット](https://utfs.io/f/MMMHiQ1TQaBobmOhsMkrO6Tl2kxX39dbuFiQ8cAoNzysIt7f)

:::info
デフォルトのAPIキーは文字列`your_api_key_here`です。追加のセキュリティが必要ない場合は、この値を変更する必要はありません。
:::

**これで完了です！ここで終了しても構いません**

# [OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts)が役立つと思ったら、GitHubで⭐️スターを付けてください

<details>
  <summary>Running with Python</summary>
  
### 🐍 Running with Python

If you prefer to run this project directly with Python, follow these steps to set up a virtual environment, install dependencies, and start the server.

#### 1. Clone the Repository

```bash
git clone https://github.com/travisvn/openai-edge-tts.git
cd openai-edge-tts
```

#### 2. Set Up a Virtual Environment

Create and activate a virtual environment to isolate dependencies:

```bash
# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
venv\Scripts\activate
```

#### 3. Install Dependencies

Use `pip` to install the required packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

#### 4. Configure Environment Variables

Create a `.env` file in the root directory and set the following variables:

```plaintext
API_KEY=your_api_key_here
PORT=5050

DEFAULT_VOICE=en-US-AvaNeural
DEFAULT_RESPONSE_FORMAT=mp3
DEFAULT_SPEED=1.0

DEFAULT_LANGUAGE=en-US

REQUIRE_API_KEY=True
REMOVE_FILTER=False
EXPAND_API=True
```

#### 5. Run the Server

Once configured, start the server with:

```bash
python app/server.py
```

The server will start running at `http://localhost:5050`.

#### 6. Test the API

You can now interact with the API at `http://localhost:5050/v1/audio/speech` and other available endpoints. See the Usage section for request examples.

</details>

<details>
  <summary>Usage details</summary>
  
##### Endpoint: `/v1/audio/speech` (aliased with `/audio/speech`)

Generates audio from the input text. Available parameters:

**Required Parameter:**

- **input** (string): The text to be converted to audio (up to 4096 characters).

**Optional Parameters:**

- **model** (string): Set to "tts-1" or "tts-1-hd" (default: `"tts-1"`).
- **voice** (string): One of the OpenAI-compatible voices (alloy, echo, fable, onyx, nova, shimmer) or any valid `edge-tts` voice (default: `"en-US-AvaNeural"`).
- **response_format** (string): Audio format. Options: `mp3`, `opus`, `aac`, `flac`, `wav`, `pcm` (default: `mp3`).
- **speed** (number): Playback speed (0.25 to 4.0). Default is `1.0`.

:::tip
You can browse available voices and listen to sample previews at [tts.travisvn.com](https://tts.travisvn.com)
:::

Example request with `curl` and saving the output to an mp3 file:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "echo",
    "response_format": "mp3",
    "speed": 1.0
  }' \
  --output speech.mp3
```

Or, to be in line with the OpenAI API endpoint parameters:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

And an example of a language other than English:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "じゃあ、行く。電車の時間、調べておくよ。",
    "voice": "ja-JP-KeitaNeural"
  }' \
  --output speech.mp3
```

##### Additional Endpoints

- **POST/GET /v1/models**: Lists available TTS models.
- **POST/GET /v1/voices**: Lists `edge-tts` voices for a given language / locale.
- **POST/GET /v1/voices/all**: Lists all `edge-tts` voices, with language support information.

:::info
The `/v1` is now optional. 

Additionally, there are endpoints for **Azure AI Speech** and **ElevenLabs** for potential future support if custom API endpoints are allowed for these options in Sage WebUI.

These can be disabled by setting the environment variable `EXPAND_API=False`.
:::

</details>

## 🐳 Dockerのクイック設定

プロジェクトを実行するコマンドで環境変数を設定できます

```bash
docker run -d -p 5050:5050 \
  -e API_KEY=your_api_key_here \
  -e PORT=5050 \
  -e DEFAULT_VOICE=en-US-AvaNeural \
  -e DEFAULT_RESPONSE_FORMAT=mp3 \
  -e DEFAULT_SPEED=1.0 \
  -e DEFAULT_LANGUAGE=en-US \
  -e REQUIRE_API_KEY=True \
  -e REMOVE_FILTER=False \
  -e EXPAND_API=True \
  travisvn/openai-edge-tts:latest
```

:::note
マークダウンテキストは、可読性とサポートを向上させるためにフィルター処理されています。

環境変数`REMOVE_FILTER=True`を設定することでこれを無効にできます。
:::

## 追加リソース

`openai-edge-tts`の詳細については、[GitHubリポジトリ](https://github.com/travisvn/openai-edge-tts)をご覧ください

直接サポートが必要な場合は、[Voice AI & TTS Discord](https://tts.travisvn.com/discord)にアクセスしてください

## 🎙️ 音声サンプル

[音声サンプルを再生し、利用可能なすべてのEdge TTS音声を確認する](https://tts.travisvn.com/)