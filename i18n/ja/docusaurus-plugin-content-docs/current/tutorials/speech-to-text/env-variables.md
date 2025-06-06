---
sidebar_position: 2
title: "Environment Variables"
---

# 環境変数一覧

:::info
Sage Open WebUIのすべての環境変数の完全なリストについては、[環境変数設定](/getting-started/env-configuration)ページを参照してください。
:::

以下は音声テキスト変換（STT）に関する環境変数の概要です。

# 音声テキスト変換（STT）の環境変数

| Variable | Description |
|----------|-------------|
| `WHISPER_MODEL` | Sets the Whisper model to use for local Speech-to-Text |
| `WHISPER_MODEL_DIR` | Specifies the directory to store Whisper model files |
| `AUDIO_STT_ENGINE` | Specifies the Speech-to-Text engine to use (empty for local Whisper, or `openai`) |
| `AUDIO_STT_MODEL` | Specifies the Speech-to-Text model for OpenAI-compatible endpoints |
| `AUDIO_STT_OPENAI_API_BASE_URL` | Sets the OpenAI-compatible base URL for Speech-to-Text |
| `AUDIO_STT_OPENAI_API_KEY` | Sets the OpenAI API key for Speech-to-Text |