### `uv`を使用したインストール

`uv`ランタイムマネージャーは、Sage WebUIのようなアプリケーションのためのシームレスなPython環境管理を保証します。開始するには以下の手順に従ってください:

#### 1. `uv`のインストール

お使いのオペレーティングシステムに適したインストールコマンドを選択してください:

- **macOS/Linux**:  
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

- **Windows**:  
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

#### 2. Sage WebUIの実行

`uv`のインストールが完了したら、Sage WebUIの実行は簡単です。データ損失を防ぐため、`DATA_DIR`環境変数を設定して以下のコマンドを使用してください。各プラットフォーム向けの例を記載します:

- **macOS/Linux**:  
  ```bash
  DATA_DIR=~/.sage-open-webui uvx --python 3.11 sage-open-webui@latest serve
  ```

- **Windows**:  
  ```powershell
  $env:DATA_DIR="C:\sage-open-webui\data"; uvx --python 3.11 sage-open-webui@latest serve
  ```