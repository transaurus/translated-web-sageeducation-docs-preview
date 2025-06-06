---
sidebar_position: 6
title: "🎨 Image Generation"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したいですか？ コントリビュートチュートリアルをチェックしてください。
:::

# 🎨 画像生成

Sage WebUIは、**AUTOMATIC1111**、**ComfyUI**、**OpenAI DALL·E**の3つのバックエンドによる画像生成をサポートしています。このガイドでは、これらのオプションのセットアップと使用方法を説明します。

## AUTOMATIC1111

Sage WebUIは、**AUTOMATIC1111**の[API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)を介した画像生成をサポートしています。開始するための手順は以下の通りです：

### 初期設定

1. [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)がインストールされていることを確認してください。
2. APIアクセスを有効にするための追加フラグを付けてAUTOMATIC1111を起動します：

   ```
   ./webui.sh --api --listen
   ```

3. 環境変数が事前設定されたWebUIのDockerインストールには、以下のコマンドを使用します：

   ```
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e AUTOMATIC1111_BASE_URL=http://host.docker.internal:7860/ -e ENABLE_IMAGE_GENERATION=True -v sage-open-webui:/app/backend/data --name sage-open-webui --restart always ghcr.io/Startr/AI-WEB-openwebui:main
   ```

### Sage WebUIとAUTOMATIC1111のセットアップ

1. Sage WebUIで、**Admin Panel** > **Settings** > **Images**メニューに移動します。
2. `Image Generation Engine`フィールドを`Default (Automatic1111)`に設定します。
3. API URLフィールドに、AUTOMATIC1111のAPIがアクセス可能なアドレスを入力します：

   ```
   http://<your_automatic1111_address>:7860/
   ```

   Sage WebUIとAUTOMATIC1111を同じホストでDockerインストールしている場合は、`http://host.docker.internal:7860/`をアドレスとして使用します。

## ComfyUI

ComfyUIは、画像生成モデルの管理と操作のための代替インターフェースを提供します。詳細やダウンロードは[GitHubページ](https://github.com/comfyanonymous/ComfyUI)をご覧ください。以下は、ComfyUIを他のツールと一緒に実行するためのセットアップ手順です。

### 初期設定

1. [GitHub](https://github.com/comfyanonymous/ComfyUI)からComfyUIソフトウェアパッケージをダウンロードし、任意のディレクトリに展開します。
2. ComfyUIを起動するには、以下のコマンドを実行します：

   ```
   python main.py
   ```

   VRAMが少ないシステムでは、メモリ使用量を減らすための追加フラグを付けてComfyUIを起動します：

   ```
   python main.py --lowvram
   ```

3. 環境変数が事前設定されたWebUIのDockerインストールには、以下のコマンドを使用します：

   ```
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e COMFYUI_BASE_URL=http://host.docker.internal:7860/ -e ENABLE_IMAGE_GENERATION=True -v sage-open-webui:/app/backend/data --name sage-open-webui --restart always ghcr.io/Startr/AI-WEB-openwebui:main
   ```

### Sage WebUIとComfyUIのセットアップ

#### FLUX.1モデルのセットアップ

1. **モデルチェックポイント**:

* [black-forest-labs HuggingFaceページ](https://huggingface.co/black-forest-labs)から`FLUX.1-schnell`または`FLUX.1-dev`モデルをダウンロードします。
* モデルチェックポイントをComfyUIの`models/checkpoints`と`models/unet`ディレクトリの両方に配置します。または、`models/checkpoints`と`models/unet`の間にシンボリックリンクを作成して、両方のディレクトリに同じモデルチェックポイントが含まれるようにすることもできます。

2. **VAEモデル**:

* [こちら](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors)から`ae.safetensors` VAEをダウンロードしてください。
* ComfyUIの`models/vae`ディレクトリに配置してください。

3. **CLIPモデル**:

* [こちら](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main)から`clip_l.safetensors`をダウンロードしてください。
* ComfyUIの`models/clip`ディレクトリに配置してください。

4. **T5XXLモデル**:

* [こちら](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main)から`t5xxl_fp16.safetensors`または`t5xxl_fp8_e4m3fn.safetensors`モデルをダウンロードしてください。
* ComfyUIの`models/clip`ディレクトリに配置してください。

ComfyUIをSage WebUIに統合するには、以下の手順に従ってください：

#### ステップ1: Sage WebUIの設定を構成

1. Sage WebUIで**管理者パネル**に移動します。
2. **設定**をクリックし、**画像**タブを選択します。
3. `画像生成エンジン`フィールドで`ComfyUI`を選択します。
4. **API URL**フィールドに、ComfyUIのAPIがアクセス可能なアドレスを次の形式で入力します：`http://<your_comfyui_address>:8188/`。
   * このアドレスを環境変数`COMFYUI_BASE_URL`に設定して、WebUI内で永続化させます。

#### ステップ2: 接続を確認し画像生成を有効化

1. ComfyUIが実行中であり、Sage WebUIへの接続が成功していることを確認してください。接続が成功していないと先に進めません。
2. 接続が確認されたら、**画像生成（実験的）**をトグルオンします。さらにオプションが表示されます。
3. 最終的な設定手順のためにステップ3に進んでください。

#### ステップ3: ComfyUIの設定を構成しワークフローをインポート

1. ComfyUI内で開発者モードを有効にします。これを行うには、ComfyUI内の**Queue Prompt**ボタンの上にある歯車アイコンを探し、`Dev Mode`トグルを有効にします。
2. ComfyUIから`API形式`で目的のワークフローをエクスポートします。`Save (API Format)`ボタンを使用してください。正しく行われると、ファイルは`workflow_api.json`としてダウンロードされます。
3. Sage WebUIに戻り、**Click here to upload a workflow.json file**ボタンをクリックします。
4. `workflow_api.json`ファイルを選択して、ComfyUIからエクスポートしたワークフローをSage WebUIにインポートします。
5. ワークフローをインポートした後、`ComfyUI Workflow Nodes`をインポートしたワークフローのノードIDに従ってマッピングする必要があります。
6. `Set Default Model`を使用するモデルファイルの名前に設定します（例：`flux1-dev.safetensors`）。

:::info
Sage WebUIの`ComfyUI Workflow Nodes`セクション内で、1つまたは2つの`Input Key`を調整する必要がある場合があります。例えば、`seed`を`noise_seed`にリネームして、インポートしたワークフロー内のノードIDと一致させる必要があるかもしれません。
:::

:::tip
Fluxモデルを使用するワークフローの場合、Sage WebUI内のノードエントリフィールドに入力する必要がある複数のノードIDを使用する場合があります。ノードエントリフィールドで複数のIDが必要な場合、ノードIDはカンマ区切りで入力してください（例：`1`または`1, 2`）。
:::

6. `Save`をクリックして設定を適用し、ComfyUIが統合されたSage WebUIで画像生成を楽しんでください！

これらの手順を完了すると、ComfyUIのセットアップがSage WebUIに統合され、Flux.1モデルを使用した画像生成が可能になります。

### SwarmUIでの構成

SwarmUIはバックエンドとしてComfyUIを利用しています。Sage WebUIをSwarmUIと連携させるには、`ComfyUI Base URL`に`ComfyBackendDirect`を追加する必要があります。さらに、SwarmUIをLANアクセス可能な状態でセットアップすることをお勧めします。上記の調整を行った後、SwarmUIをSage WebUIと連携させる手順は、前述の[ステップ1: Sage WebUI設定の構成](https://github.com/Startr/docs/edit/main/docs/features/images.md#step-1-configure-sage-open-webui-settings)と同様になります。
![SwarmUIをLANアクセスでインストール](https://github.com/user-attachments/assets/a6567e13-1ced-4743-8d8e-be526207f9f6)

#### SwarmUI API URL

ComfyUI Base URLとして入力するアドレスは次のようになります: `http://<your_swarmui_address>:7801/ComfyBackendDirect`

## OpenAI DALL·E

Sage WebUIは**OpenAI DALL·E API**を介した画像生成もサポートしています。このオプションでは、DALL·E 2とDALL·E 3の選択が可能で、それぞれ異なる画像サイズをサポートしています。

### 初期設定

1. OpenAIから[APIキー](https://platform.openai.com/api-keys)を取得します。

### Sage WebUIの設定

1. Sage WebUIで**管理者パネル** > **設定** > **画像**メニューに移動します。
2. `Image Generation Engine`フィールドを`Open AI (Dall-E)`に設定します。
3. OpenAI APIキーを入力します。
4. 使用するDALL·Eモデルを選択します。画像サイズのオプションは選択したモデルによって異なります:
   * **DALL·E 2**: `256x256`、`512x512`、`1024x1024`の画像をサポート。
   * **DALL·E 3**: `1024x1024`、`1792x1024`、`1024x1792`の画像をサポート。

### Azure OpenAI

Azure OpenAI Dall-Eを直接使用することはサポートされていませんが、[LiteLLMプロキシを設定](https://litellm.vercel.app/docs/image_generation)することで、`Open AI (Dall-E)` Image Generation Engineと互換性を持たせることができます。

## 画像生成の使用

![画像生成チュートリアル](/images/tutorial_image_generation.png)

1. 最初に、テキスト生成モデルを使用して画像生成用のプロンプトを作成します。
2. 応答が完了したら、Pictureアイコンをクリックして画像を生成できます。
3. 画像の生成が完了すると、自動的にチャットに返されます。

:::tip
    LLMの応答を編集し、実際の応答ではなく、画像生成プロンプトをメッセージとして送信することもできます。
:::