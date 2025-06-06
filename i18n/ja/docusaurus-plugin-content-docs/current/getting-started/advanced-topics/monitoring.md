---
sidebar_position: 6
title: "📊 Monitoring"
---

# Sage Open WebUIの監視

Sage Open WebUIインスタンスを監視することは、信頼性の高いサービスを確保し、問題を迅速に特定するために重要です。このガイドでは、以下の3つのレベルの監視について説明します：

- サービス可用性の基本的なヘルスチェック
- モデル接続の検証
- モデル応答テストによる詳細なヘルスチェック

## 基本的なヘルスチェックエンドポイント

Sage Open WebUIは、サービスが正常に動作している場合に200 OKステータスを返すヘルスチェックエンドポイントを`/health`で公開しています。

```bash
   # No auth needed for this endpoint
   curl https://your-sage-instance/health
```

### Uptime Kumaの使用

[Uptime Kuma](https://github.com/louislam/uptime-kuma)は、使いやすく、オープンソースで、セルフホスト型の稼働時間監視ツールです。

1. Uptime Kumaダッシュボードで「新しいモニターを追加」をクリック
2. 以下の設定を行います：
   - モニタータイプ：HTTP(s)
   - 名前：Sage Open WebUI
   - URL：`http://your-sage-instance:8080/health`
   - 監視間隔：60秒（または希望の間隔）
   - リトライ回数：3回（推奨）

ヘルスチェックでは以下を確認します：

- Webサーバーが応答していること
- アプリケーションが実行中であること
- 基本的なデータベース接続

## Sage Open WebUIモデル接続性

Sage Open WebUIが設定済みのモデルに正常に接続およびリストできることを確認するには、モデルエンドポイントを監視します。このエンドポイントは認証が必要で、Sage Open WebUIがモデルプロバイダーと通信できることを確認します。

モデルエンドポイントの詳細については、[APIドキュメント](https://docs.openwebui.com/getting-started/api-endpoints/#-retrieve-all-models)を参照してください。

```bash
   # See steps below to get an API key
   curl -H "Authorization: Bearer sk-adfadsflkhasdflkasdflkh" https://your-sage-instance/api/models
```

### 認証設定

1. APIキーを有効化（管理者権限が必要）：
   - 管理者設定 > 一般に移動
   - 「APIキーを有効化」設定を有効にする
   - 変更を保存

2. APIキーを取得[docs](https://docs.openwebui.com/getting-started/api-endpoints)：
   - （オプション）監視用APIキーのために非管理者ユーザーを作成することを検討
   - Sage Open WebUIの設定 > アカウントに移動
   - 監視専用の新しいAPIキーを生成
   - Uptime Kumaで使用するためにAPIキーをコピー

注：設定 > アカウントでAPIキーを生成するオプションが表示されない場合は、管理者に確認してAPIキーが有効になっていることを確認してください。

### モデル接続性のためのUptime Kuma使用

1. Uptime Kumaで新しいモニターを作成：
   - モニタータイプ：HTTP(s) - JSON Query
   - 名前：Sage Open WebUIモデル接続性
   - URL：`http://your-sage-instance:8080/api/models`
   - メソッド：GET
   - 期待されるステータスコード：200
   - JSONクエリ：`$count(data[*])>0`
   - 期待値：`true`  
   - 監視間隔：300秒（5分推奨）

2. 認証を設定：
   - ヘッダーセクションで以下を追加：
     ```
     {
        "Authorization": "Bearer sk-abc123adfsdfsdfsdfsfdsdf"
     }
     ```
   - `YOUR_API_KEY`を生成したAPIキーに置き換え

代替JSONクエリ：

```
# At least 1 models by ollama provider
$count(data[owned_by='ollama'])>1

# Check if specific model exists (returns true/false)
$exists(data[id='gpt-4o'])

# Check multiple models (returns true if ALL exist)
$count(data[id in ['gpt-4o', 'gpt-4o-mini']]) = 2
```

JSONataクエリは[jsonata.org](https://try.jsonata.org/)でテストして、API応答で動作することを確認できます。

## モデル応答テスト

モデルが実際にリクエストを処理できることを確認するには、チャット補完エンドポイントを監視します。これにより、モデルが応答を生成できることを確認する詳細なヘルスチェックが提供されます。

```bash
# Test model response
curl -X POST https://your-sage-instance/api/chat/completions \
  -H "Authorization: Bearer sk-adfadsflkhasdflkasdflkh" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Respond with the word HEALTHY"}],
    "model": "llama3.1",
    "temperature": 0
  }'
```