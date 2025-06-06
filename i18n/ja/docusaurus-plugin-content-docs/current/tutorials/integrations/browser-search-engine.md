---
sidebar_position: 16
title: "🌐 Browser Search Engine"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをチェックしてください。
:::

# ブラウザ検索エンジン連携

Sage WebUIはWebブラウザに直接統合することが可能です。このチュートリアルでは、Sage WebUIをカスタム検索エンジンとして設定し、ブラウザのアドレスバーから簡単にクエリを実行できるようにする手順を説明します。

## Sage WebUIを検索エンジンとして設定する

### 前提条件

開始前に、以下を確認してください:

- Chromeまたは他のサポート対象ブラウザがインストールされていること
- `WEBUI_URL`環境変数が正しく設定されていること（Docker環境変数または[はじめに](/getting-started/env-configuration)ガイドで指定されている`.env`ファイル内）

### ステップ1: WEBUI_URL環境変数の設定

`WEBUI_URL`環境変数を設定することで、ブラウザがクエリをどこに送信するかを認識できるようになります。

#### Docker環境変数の使用

Dockerを使用してSage WebUIを実行している場合、`docker run`コマンドで環境変数を設定できます:

```bash
docker run -d \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v sage-open-webui:/app/backend/data \
  --name sage-open-webui \
  --restart always \
  -e WEBUI_URL="https://<your-sage-open-webui-url>" \
  ghcr.io/Startr/AI-WEB-openwebui:main
```

または、`.env`ファイルに変数を追加することも可能です:

```plaintext
WEBUI_URL=https://<your-sage-open-webui-url>
```

### ステップ2: カスタム検索エンジンとしてSage WebUIを追加

### Chromeの場合

1. Chromeを開き、**設定**に移動します
2. サイドバーから**検索エンジン**を選択し、**検索エンジンの管理**をクリックします
3. **追加**をクリックして新しい検索エンジンを作成します
4. 以下のように詳細を入力します:
    - **検索エンジン**: Sage WebUI検索
    - **キーワード**: webui（または任意のキーワード）
    - **クエリの代わりに%sを含むURL**:

      ```
      https://<your-sage-open-webui-url>/?q=%s
      ```

5. **追加**をクリックして設定を保存します

### Firefoxの場合

1. FirefoxでSage WebUIにアクセスします
2. アドレスバーをクリックして展開します
3. 展開されたアドレスバーの下部にある緑色の円で囲まれたプラスアイコンをクリックします。これにより、Sage WebUIの検索が設定の検索エンジンに追加されます

別の方法:

1. FirefoxでSage WebUIにアクセスします
2. アドレスバーを右クリックします
3. コンテキストメニューから「Sage WebUIを追加」（または類似のオプション）を選択します

### オプション: 特定のモデルを使用する

検索に特定のモデルを使用したい場合、URL形式を変更してモデルIDを含めることができます:

```
https://<your-sage-open-webui-url>/?models=<model_id>&q=%s
```

**注:** モデルIDはURLエンコードする必要があります。スペースやスラッシュなどの特殊文字はエンコードが必要です（例: `my model`は`my%20model`になります）。

## 使用例

検索エンジンの設定が完了すると、アドレスバーから直接検索を実行できます。選択したキーワードに続けてクエリを入力します:

```
webui your search query
```

このコマンドは、検索結果と共にSage WebUIインターフェースにリダイレクトします。

## トラブルシューティング

問題が発生した場合は、以下を確認してください:

- `WEBUI_URL`が正しく設定され、有効なSage WebUIインスタンスを指していることを確認してください
- ブラウザ設定で検索エンジンURL形式が正しく入力されていることを再確認してください
- インターネット接続がアクティブで、Sage WebUIサービスが正常に実行されていることを確認してください