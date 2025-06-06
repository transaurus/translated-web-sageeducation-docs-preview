---
sidebar_position: 2
title: "🗨️ Kokoro-FastAPI Using Docker"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したい方は、コントリビューションガイドをご覧ください。
:::

## `Kokoro-FastAPI`とは？

[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI)は、[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)テキスト読み上げモデルをDocker化したFastAPIラッパーで、OpenAI APIエンドポイント仕様を実装しています。高速なテキスト読み上げを実現します。

## 主な特徴

- OpenAI互換の音声エンドポイント（インライン音声合成対応）
- NVIDIA GPUアクセラレーションまたはCPU Onnx推論
- 可変チャンクストリーミング対応
- 複数音声形式対応（`.mp3`、`.wav`、`.opus`、`.flac`、`.aac`、`.pcm`）
- 統合Webインターフェース（localhost:8880/web）
- 音素変換/生成用エンドポイント

## 音声タイプ

- af
- af_bella
- af_irulan
- af_nicole
- af_sarah
- af_sky
- am_adam
- am_michael
- am_gurney
- bf_emma
- bf_isabella
- bm_george
- bm_lewis

## 対応言語

- en_us
- en_uk

## システム要件

- Dockerがインストールされたシステム
- Sage WebUIの稼動
- GPU利用の場合：CUDA 12.3対応NVIDIA GPU
- CPUのみの場合：特別な要件なし

## ⚡️ クイックスタート

### GPU版とCPU版から選択可能

### GPU版（CUDA 12.1対応NVIDIA GPU必須）

docker runを使用:

```bash
docker run --gpus all -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-gpu
```

またはdocker composeを使用する場合、`docker-compose.yml`ファイルを作成し`docker compose up`を実行。例:

```yaml
name: kokoro
services:
    kokoro-fastapi-gpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-gpu:v0.2.1
        restart: always
        deploy:
            resources:
                reservations:
                    devices:
                        - driver: nvidia
                          count: all
                          capabilities:
                              - gpu
```

:::info
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)のインストールと設定が必要な場合があります
:::

### CPU版（ONNX最適化推論）

docker runで実行:

```bash
docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu
```

docker composeで実行:

```yaml
name: kokoro
services:
    kokoro-fastapi-cpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-cpu
        restart: always
```

## Sage WebUIで`Kokoro-FastAPI`を使用する設定

Sage WebUIでKokoro-FastAPIを使用するには以下の手順に従ってください:

- 管理パネルを開き、`設定` → `音声`に移動
- TTS設定を以下のように設定:
  - テキスト読み上げエンジン: OpenAI
  - APIベースURL: `http://localhost:8880/v1`（`localhost`の代わりに`host.docker.internal`が必要な場合あり）
  - APIキー: `not-needed`
  - TTSモデル: `kokoro`
  - TTS音声: `af_bella`（互換性のため既存OAI音声のマッピングも可能）

:::info
デフォルトAPIキーは`not-needed`です。追加のセキュリティが必要でない限り、この値を変更する必要はありません。
:::

## Dockerコンテナのビルド

```bash
git clone https://github.com/remsky/Kokoro-FastAPI.git
cd Kokoro-FastAPI
cd docker/cpu # or docker/gpu
docker compose up --build
```

**以上です！**

ポート変更を含むDockerコンテナのビルドに関する詳細は、[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI)リポジトリを参照してください