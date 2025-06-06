---
sidebar_position: 2
title: "🗨️ Openedai-speech Using Docker"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとしてのみ提供されています。寄稿したいですか？寄稿チュートリアルをチェックしてください。
:::

**Dockerを使用してSage WebUIに`openedai-speech`を統合する**
==============================================================

**`openedai-speech`とは？**
-----------------------------

:::info
[openedai-speech](https://github.com/matatonic/openedai-speech)は、OpenAIのオーディオ/音声APIと互換性のあるテキスト読み上げサーバーです。

`/v1/audio/speech`エンドポイントを提供し、カスタム音声クローニング機能を備えた無料のプライベートなテキスト読み上げ体験を実現します。このサービスはOpenAIとは一切関係がなく、OpenAIのAPIキーも必要ありません。
:::

**要件**
-----------------

* システムにDockerがインストールされていること
* Sage WebUIがDockerコンテナで実行されていること
* DockerとDocker Composeの基本的な理解

**オプション1: Docker Composeを使用する**
----------------------------------

**ステップ1: `openedai-speech`サービスのための新しいフォルダを作成する**
-----------------------------------------------------------------

`openedai-speech-service`などの新しいフォルダを作成し、`docker-compose.yml`と`speech.env`ファイルを保存します。

**ステップ2: GitHubから`openedai-speech`リポジトリをクローンする**
--------------------------------------------------------------

```bash
git clone https://github.com/matatonic/openedai-speech.git
```

これにより、`openedai-speech`リポジトリがローカルマシンにダウンロードされます。リポジトリにはDocker Composeファイル（`docker-compose.yml`、`docker-compose.min.yml`、`docker-compose.rocm.yml`）やその他の必要なファイルが含まれています。

**ステップ3: `sample.env`ファイルを`speech.env`にリネームする（必要に応じてカスタマイズ）**
------------------------------------------------------------------------------

`openedai-speech`リポジトリフォルダ内に、以下の内容で`speech.env`という名前の新しいファイルを作成します：

```yaml
TTS_HOME=voices
HF_HOME=voices
#PRELOAD_MODEL=xtts
#PRELOAD_MODEL=xtts_v2.0.2
#PRELOAD_MODEL=parler-tts/parler_tts_mini_v0.1
#EXTRA_ARGS=--log-level DEBUG --unload-timer 300
#USE_ROCM=1
```

**ステップ4: Docker Composeファイルを選択する**
----------------------------------------

以下のいずれかのDocker Composeファイルを使用できます：

* [docker-compose.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.yml): このファイルは`ghcr.io/matatonic/openedai-speech`イメージを使用し、[Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile)からビルドします。
* [docker-compose.min.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.min.yml): このファイルは`ghcr.io/matatonic/openedai-speech-min`イメージを使用し、[Dockerfile.min](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile.min)からビルドします。
  このイメージはPiperサポートのみを含む最小バージョンで、GPUを必要としません。
* [docker-compose.rocm.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.rocm.yml): このファイルは`ghcr.io/matatonic/openedai-speech-rocm`イメージを使用し、ROCmサポートを備えた[Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile)からビルドします。

**ステップ4: 選択したDockerイメージをビルドする**
-----------------------------------------

Docker Composeファイルを実行する前に、Dockerイメージをビルドする必要があります：

* **Nvidia GPU (CUDAサポート)**:

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
```

* **AMD GPU (ROCmサポート)**:

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
```

* **CPUのみ、GPUなし（Piperのみ）**:

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
```

**ステップ5: 正しい`docker compose up -d`コマンドを実行する**
----------------------------------------------------------

* **NVIDIA GPU（CUDAサポート）**: 以下のコマンドを実行して、`openedai-speech`サービスをデタッチモードで起動します:

```bash
docker compose up -d
```

* **AMD GPU（ROCmサポート）**: 以下のコマンドを実行して、`openedai-speech`サービスをデタッチモードで起動します:

```bash
docker compose -f docker-compose.rocm.yml up -d
```

* **ARM64（Apple Mシリーズ、Raspberry Pi）**: XTTSはここではCPUサポートのみで非常に遅くなります。XTTS用のNVIDIAイメージをCPUで使用する（遅い）か、Piperのみのイメージを使用する（推奨）ことができます:

```bash
docker compose -f docker-compose.min.yml up -d
```

* **CPUのみ、GPUなし（Piperのみ）**: Piperサポートのみの最小限のDockerイメージ（< 1GB vs. 8GB）の場合:

```bash
docker compose -f docker-compose.min.yml up -d
```

これにより、`openedai-speech`サービスがデタッチモードで起動します。

**オプション2: Docker Runコマンドを使用する**
---------------------------------------

以下のDocker runコマンドを使用して、`openedai-speech`サービスをデタッチモードで起動することもできます:

* **NVIDIA GPU（CUDA）**: 以下のコマンドを実行して、`openedai-speech`サービスをビルドおよび起動します:

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
docker run -d --gpus=all -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech
```

* **ROCm（AMD GPU）**: 以下のコマンドを実行して、`openedai-speech`サービスをビルドおよび起動します:

> ROCmサポートを有効にするには、`speech.env`ファイルの`#USE_ROCM=1`行のコメントを解除してください。

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
docker run -d --privileged --init --name openedai-speech -p 8000:8000 -v voices:/app/voices -v config:/app/config ghcr.io/matatonic/openedai-speech-rocm
```

* **CPUのみ、GPUなし（Piperのみ）**: 以下のコマンドを実行して、`openedai-speech`サービスをビルドおよび起動します:

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
docker run -d -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech-min
```

**ステップ6: Sage WebUIを設定して`openedai-speech`をTTSに使用する**
---------------------------------------------------------

![openedai-tts](https://github.com/silentoplayz/docs/assets/50341825/ea08494f-2ebf-41a2-bb0f-9b48dd3ace79)

Sage WebUIの設定を開き、**管理パネル > 設定 > オーディオ**の下にあるTTS設定に移動します。以下の設定を追加してください:

* **APIベースURL**: `http://host.docker.internal:8000/v1`
* **APIキー**: `sk-111111111`（これはダミーのAPIキーです。`openedai-speech`はAPIキーを必要としません。このフィールドには何を入れても構いませんが、入力されている必要があります。）

**ステップ7: 音声を選択する**
--------------------------

管理パネルの同じオーディオ設定メニュー内の`TTS Voice`で、以下の`openedai-speech`がサポートする`TTS Model`を設定できます。これらのモデルの音声は英語用に最適化されています。

* `tts-1`または`tts-1-hd`: `alloy`, `echo`, `echo-alt`, `fable`, `onyx`, `nova`, `shimmer`（`tts-1-hd`は設定可能；デフォルトでOpenAIのサンプルを使用）

**ステップ8: `保存`を押して変更を適用し、自然な音声を楽しむ**
--------------------------------------------------------------------------------------------

`保存`ボタンを押して、Sage WebUIの設定に変更を適用します。ページを更新して変更を完全に反映させ、Sage WebUI内で`openedai-speech`統合を使用して、テキスト応答を自然な音声で読み上げるテキスト読み上げを楽しんでください。

**モデルの詳細:**
------------------

`openedai-speech`は、それぞれ独自の強みと要件を持つ複数のテキスト読み上げモデルをサポートしています。以下のモデルが利用可能です:

* **Piper TTS**（非常に高速、CPUで動作）: [Piper voices](https://rhasspy.github.io/piper-samples/)を`voice_to_speaker.yaml`設定ファイルで使用できます。このモデルは低遅延と高性能が求められるアプリケーションに最適です。Piper TTSは[多言語](https://github.com/matatonic/openedai-speech#multilingual)音声もサポートしています。
* **Coqui AI/TTS XTTS v2**（高速ですが、約4GBのGPU VRAMとNvidia GPU（CUDA対応）が必要）: このモデルはCoqui AIのXTTS v2音声クローニング技術を使用して高品質な音声を生成します。より強力なGPUが必要ですが、優れたパフォーマンスと高品質なオーディオを提供します。Coquiも[多言語](https://github.com/matatonic/openedai-speech#multilingual)音声をサポートしています。
* **Beta Parler-TTSサポート**（実験的、低速）: このモデルはParler-TTSフレームワークを使用して音声を生成します。現在はベータ版ですが、話者の声の非常に基本的な特徴を記述できます。生成ごとに正確な声は少し異なりますが、提供された話者の説明と似たものになります。声の記述方法のインスピレーションについては、[Text Description to Speech](https://www.text-description-to-speech.com/)を参照してください。

**トラブルシューティング**
-------------------

Sage WebUIと`openedai-speech`の統合で問題が発生した場合は、以下のトラブルシューティング手順に従ってください：

* **`openedai-speech`サービスの確認**: `openedai-speech`サービスが実行中であり、docker-compose.ymlファイルで指定したポートが公開されていることを確認してください。
* **host.docker.internalへのアクセス確認**: Sage WebUIコンテナ内からホスト名`host.docker.internal`が解決可能であることを確認してください。これは、`openedai-speech`がPCの`localhost`で公開されていますが、`sage-open-webui`は通常コンテナ内からアクセスできないため必要です。たとえば、ホストからコンテナにファイルをマウントするために、`docker-compose.yml`ファイルにボリュームを追加できます。
* **APIキー設定の確認**: APIキーがダミー値に設定されているか、または`openedai-speech`がAPIキーを必要としないため、実質的にチェックされていないことを確認してください。
* **音声設定の確認**: TTSに使用しようとしている音声が`voice_to_speaker.yaml`ファイルに存在し、対応するファイル（例：音声XMLファイル）が正しいディレクトリにあることを確認してください。
* **音声モデルパスの確認**: 音声モデルの読み込みに問題がある場合は、`voice_to_speaker.yaml`ファイル内のパスが音声モデルの実際の場所と一致していることを再確認してください。

**追加のトラブルシューティングのヒント**
------------------------------------

* openedai-speechのログを確認し、問題の原因を示すエラーや警告がないか調べてください。
* `docker-compose.yml`ファイルが環境に合わせて正しく設定されていることを確認してください。
* 問題が解決しない場合は、`openedai-speech`サービスまたはDocker環境全体を再起動してみてください。
* 問題が続く場合は、`openedai-speech`のGitHubリポジトリを参照するか、関連するコミュニティフォーラムで助けを求めてください。

**FAQ**
-------

**生成されたオーディオの感情範囲を制御するにはどうすればよいですか？**

生成されたオーディオの感情出力を直接制御するメカニズムはありません。大文字化や文法などの特定の要因が出力オーディオに影響を与える可能性がありますが、内部テストでは結果がまちまちでした。

**音声ファイルはどこに保存されますか？設定ファイルはどうですか？**

設定ファイル（利用可能な音声とそのプロパティを定義する）はconfigボリュームに保存されます。具体的には、デフォルトの音声は`voice_to_speaker.default.yaml`で定義されています。

**追加リソース**
------------------------

Sage WebUIで`openedai-speech`を使用するための設定（環境変数の設定を含む）の詳細については、[Sage WebUIドキュメント](/getting-started/env-configuration#text-to-speech)を参照してください。

`openedai-speech`の詳細については、[GitHubリポジトリ](https://github.com/matatonic/openedai-speech)をご覧ください。

**openedai-speechに音声を追加する方法:**
[カスタム音声追加ガイド](https://github.com/matatonic/openedai-speech?tab=readme-ov-file#custom-voices-howto)

:::note
`docker-compose.yml`ファイルでポート番号を変更可能ですが、Sage WebUI管理者画面のAudio設定にある**API Base URL**も合わせて更新してください。
:::