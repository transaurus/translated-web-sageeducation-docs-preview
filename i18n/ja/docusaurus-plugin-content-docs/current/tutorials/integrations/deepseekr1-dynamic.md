---
sidebar_position: 1
title: "🐋 Run DeepSeek R1 Dynamic 1.58-bit with Llama.cpp"
---

**UnslothAI**の素晴らしい努力に心からの感謝を！彼らの尽力により、**完全版DeepSeek-R1** 671Bパラメータモデルを動的1.58ビット量子化形式（131GBに圧縮）で**Llama.cpp**上で動作させられるようになりました！そして何より嬉しいのは、大規模なエンタープライズクラスのGPUやサーバーを必要とせず、個人のマシン（ただしほとんどのコンシューマーハードウェアでは低速ですが）でこのモデルを実行可能になったことです。

:::note
Ollamaで利用可能な真の**DeepSeek-R1**モデルは、以下の**671Bバージョン**のみです: [https://ollama.com/library/deepseek-r1:671b](https://ollama.com/library/deepseek-r1:671b)。他のバージョンは**蒸留**モデルです。
:::

このガイドでは、**Llama.cpp**と統合した**Sage WebUI**を使用して**完全版DeepSeek-R1動的1.58ビット量子化モデル**を実行する手順に焦点を当てます。本チュートリアルでは**M4 Max + 128GB RAM**マシンでの設定例を示しますが、各自の環境に合わせて調整可能です。

---

## ステップ1: Llama.cppのインストール

以下のいずれかの方法でインストールできます:

- [プリビルド済みバイナリをダウンロード](https://github.com/ggerganov/llama.cpp/releases)  
- **または自分でビルド**: [Llama.cppビルドガイド](https://github.com/ggerganov/llama.cpp/blob/master/docs/build.md)の手順に従ってください

## ステップ2: UnslothAI提供のモデルをダウンロード

[UnslothのHugging Faceページ](https://huggingface.co/unsloth/DeepSeek-R1-GGUF)にアクセスし、適切な**動的量子化バージョン**のDeepSeek-R1をダウンロードしてください。本チュートリアルでは、高度に最適化されながら驚くほど機能性を保つ**1.58ビット版（131GB）**を使用します。

:::tip
「作業ディレクトリ」（Pythonスクリプトやターミナルセッションを実行している場所）を把握してください。モデルファイルはデフォルトでそのサブフォルダにダウンロードされるため、パスを確認しておきましょう。例えば`/Users/yourname/Documents/projects`で以下のコマンドを実行する場合、ダウンロードされたモデルは`/Users/yourname/Documents/projects/DeepSeek-R1-GGUF`に保存されます。
:::

UnslothAIの開発プロセスと、なぜこれらの動的量子化バージョンがこれほど効率的なのかについて詳しく知りたい場合は、彼らのブログ記事を参照してください: [UnslothAI DeepSeek R1 Dynamic Quantization](https://unsloth.ai/blog/deepseekr1-dynamic)。

プログラムでモデルをダウンロードする方法は以下の通りです:

```python
# Install Hugging Face dependencies before running this:
# pip install huggingface_hub hf_transfer

from huggingface_hub import snapshot_download

snapshot_download(
    repo_id = "unsloth/DeepSeek-R1-GGUF",  # Specify the Hugging Face repo
    local_dir = "DeepSeek-R1-GGUF",         # Model will download into this directory
    allow_patterns = ["*UD-IQ1_S*"],        # Only download the 1.58-bit version
)
```

ダウンロードが完了すると、モデルファイルは以下のようなディレクトリ構造で見つかります:

```
DeepSeek-R1-GGUF/
├── DeepSeek-R1-UD-IQ1_S/
│   ├── DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf
│   ├── DeepSeek-R1-UD-IQ1_S-00002-of-00003.gguf
│   ├── DeepSeek-R1-UD-IQ1_S-00003-of-00003.gguf
```

:::info
🛠️ 後のステップで使用するパスは**実際のディレクトリ構造に合わせて更新**してください。例えばスクリプトが`/Users/tim/Downloads`にある場合、GGUFファイルへのフルパスは:  
`/Users/tim/Downloads/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf`となります。
:::

## ステップ3: Sage WebUIのインストールと起動確認

**Sage WebUI**がまだインストールされていない場合でも心配ありません！簡単にセットアップできます。[Sage WebUIドキュメント](/ja)に従ってインストール後、アプリケーションを起動してください。後のステップでDeepSeek-R1モデルと接続します。

## ステップ4: Llama.cppを使用してモデルをサーバーとして起動

モデルのダウンロードが完了したら、次は**Llama.cppのサーバーモード**で実行します。開始前に以下の点を確認してください:

1. **`llama-server`バイナリの場所を確認する**  
   ソースからビルドした場合（ステップ1で説明した通り）、`llama-server`実行ファイルは`llama.cpp/build/bin`にあります。`cd`コマンドでこのディレクトリに移動します:  
   ```bash
   cd [path-to-llama-cpp]/llama.cpp/build/bin
   ```

   `[path-to-llama-cpp]`はLlama.cppをクローンまたはビルドした場所に置き換えてください。例:  
   ```bash
   cd ~/Documents/workspace/llama.cpp/build/bin
   ```

2. **モデルフォルダを指定する**  
   ステップ2でダウンロードしたGGUFファイルのフルパスを使用します。モデルをサーバーで実行する際は、分割されたGGUFファイルの最初の部分を指定します（例: `DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf`）。

サーバーを起動するコマンドは以下の通りです:

```bash
./llama-server \
    --model /[your-directory]/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --port 10000 \
    --ctx-size 1024 \
    --n-gpu-layers 40
```

:::tip
🔑 **マシンに応じてカスタマイズするパラメータ:**  

- **`--model`:** GGUFファイルがダウンロードされたパスに`/[your-directory]/`を置き換えます（ステップ2参照）。  
- **`--port`:** サーバーのデフォルトポートは`8080`ですが、利用可能なポートに変更可能です。  
- **`--ctx-size`:** コンテキスト長（トークン数）を決定します。ハードウェアが許せば増やせますが、RAM/VRAM使用量の増加に注意してください。  
- **`--n-gpu-layers`:** GPUにオフロードするレイヤー数を設定し、推論を高速化します。具体的な数はGPUメモリ容量に依存します — Unslothの表を参照して推奨値を確認してください。
:::

例えば、モデルが`/Users/tim/Documents/workspace`にダウンロードされた場合、コマンドは以下のようになります:

```bash
./llama-server \
    --model /Users/tim/Documents/workspace/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --port 10000 \
    --ctx-size 1024 \
    --n-gpu-layers 40
```

サーバーが起動すると、以下の場所で**ローカルのOpenAI互換API**エンドポイントがホストされます:

```
http://127.0.0.1:10000
```

:::info
🖥️ **Llama.cppサーバー稼働中**  

![サーバースクリーンショット](/images/tutorials/deepseek/serve.png)  

コマンド実行後、サーバーがポート10000でアクティブに待機していることを確認するメッセージが表示されます。
:::

**このターミナルセッションは実行したままにしてください**。これにより、モデルが以降のステップで利用可能になります。

## ステップ5: Llama.cppをSage WebUIに接続する

1. Sage WebUIの**管理者設定**に移動します。  
2. **接続 > OpenAI接続**に進みます。  
3. 新しい接続に以下の詳細を追加します:  
   - URL: `http://127.0.0.1:10000/v1`（DockerでSage WebUIを実行している場合は`http://host.docker.internal:10000/v1`）
   - APIキー: `none`

:::info
🖥️ **Sage WebUIでの接続追加**  

![接続スクリーンショット](/images/tutorials/deepseek/connection.png)  

コマンド実行後、サーバーがポート10000でアクティブに待機していることを確認するメッセージが表示されます。
:::

接続を保存すると、Sage WebUIから直接**DeepSeek-R1**にクエリを実行できるようになります！ 🎉

---

## 例: 応答の生成

これで、Sage WebUIのチャットインターフェースを使用して**DeepSeek-R1 Dynamic 1.58-bitモデル**と対話できます。

![応答スクリーンショット](/images/tutorials/deepseek/response.png)

---

## 注意点と考慮事項

- **パフォーマンス:**  
  DeepSeek-R1のような131GBもの大規模モデルを個人のハードウェアで実行すると、**非常に遅くなります**。M4 Max（128GB RAM）のような高性能マシンでも、推論速度は控えめです。しかし、それでも動作するという事実は、UnslothAIの最適化の賜物です。  

- **VRAM/メモリ要件:**  
  最適なパフォーマンスを得るには、十分なVRAMとシステムRAMを確保してください。ローエンドGPUやCPUのみの環境では、速度がさらに低下します（それでも実行可能です！）。

---

**UnslothAI**と**Llama.cpp**のおかげで、オープンソースの大規模推論モデルである**DeepSeek-R1**（1.58ビット版）を個人でも実行できるようになりました。このようなモデルをコンシューマーハードウェアで実行するのは困難ですが、大規模な計算インフラなしで実現できることは、技術的な大きな進歩です。

⭐ オープンAI研究の限界を押し広げるコミュニティに感謝します。

楽しい実験を！ 🚀