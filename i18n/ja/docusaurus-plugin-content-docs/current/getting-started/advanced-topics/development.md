---
sidebar_position: 5
title: "🛠️ Development Guide"
---

**Sage WebUI 開発環境セットアップガイド**へようこそ！初心者から経験豊富な開発者まで、フロントエンドとバックエンドの両コンポーネントをローカル環境でセットアップする手順を解説します。さあ、始めましょう！🚀

## システム要件

- **オペレーティングシステム**: Linux（またはWindows上のWSL）またはmacOS  
- **Pythonバージョン**: Python 3.11以上  
- **Node.jsバージョン**: 22.10以上

## 開発方法

### 🐧 ローカル開発環境のセットアップ

1. **リポジトリのクローン**:

   ```bash
   git clone https://github.com/Startr/AI-WEB-openwebui.git
   cd sage-open-webui
   ```

2. **フロントエンドのセットアップ**:
   - `.env`ファイルの作成:

     ```bash
     cp -RPp .env.example .env
     ```

   - 依存関係のインストール:

     ```bash
     npm install
     ```

   - フロントエンドサーバーの起動:

     ```bash
     npm run dev
     ```

     🌐 アクセス先: [http://localhost:5173](http://localhost:5173).

3. **バックエンドのセットアップ**:
   - バックエンドディレクトリに移動:

     ```bash
     cd backend
     ```

   - **Conda**を使用した環境構築:

     ```bash
     conda create --name sage-open-webui python=3.11
     conda activate sage-open-webui
     ```

   - 依存関係のインストール:

     ```bash
     pip install -r requirements.txt -U
     ```

   - バックエンドの起動:

     ```bash
     sh dev.sh
     ```

     📄 APIドキュメント: [http://localhost:8080/docs](http://localhost:8080/docs).

## 🐛 トラブルシューティング

### **FATAL ERROR: Reached Heap Limit**

ビルド中にメモリ関連のエラーが発生した場合、**Node.jsのヒープサイズ**を増やしてください:

1. **Dockerfileの修正**:

   ```dockerfile
   ENV NODE_OPTIONS=--max-old-space-size=4096
   ```

2. **Node.jsに4GB以上のRAM**を割り当てます。

---

### **その他の問題**

- **ポート競合**:  
   **ポート8080または5173**が他のプロセスで使用されていないことを確認してください。

- **ホットリロードが機能しない**:  
   フロントエンドとバックエンドの両方で**ウォッチモード**が有効になっていることを確認してください。

## Sage WebUIへの貢献

### ローカルワークフロー

1. **変更を定期的にコミット**して進捗を記録します。
2. **メインブランチとの同期**を取って競合を防ぎます:

   ```bash
   git pull origin main
   ```

3. **プッシュ前にテストを実行**:

   ```bash
   npm run test
   ```

Happy coding! 🎉