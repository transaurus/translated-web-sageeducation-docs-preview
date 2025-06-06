---
sidebar_position: 400
title: "🔗 API Endpoints"
---

このガイドでは、当社のモデルを使用してシームレスな統合と自動化を実現するためのAPIエンドポイントとの効果的な連携方法についての基本情報を提供します。これは実験的なセットアップであり、今後のアップデートで機能強化が行われる可能性があることにご注意ください。

## 認証

APIへの安全なアクセスを確保するため、認証が必要です🛡️。Bearer Tokenメカニズムを使用してAPIリクエストを認証できます。APIキーはSage WebUIの**設定 > アカウント**から取得するか、あるいはJWT（JSON Web Token）を使用して認証を行います。

## 主要なAPIエンドポイント

### 📜 すべてのモデルを取得

- **エンドポイント**: `GET /api/models`
- **説明**: Sage WebUIで作成または追加されたすべてのモデルを取得します。
- **例**:

  ```bash
  curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/models
  ```

### 💬 チャット補完

- **エンドポイント**: `POST /api/chat/completions`
- **説明**: Sage WebUI上のモデル（Ollamaモデル、OpenAIモデル、Sage WebUI Functionモデルを含む）に対するOpenAI API互換のチャット補完エンドポイントとして機能します。
- **例**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "llama3.1",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

### 🧩 Retrieval Augmented Generation (RAG)

Retrieval Augmented Generation (RAG)機能を使用すると、外部ソースからのデータを組み込むことで応答を強化できます。以下では、APIを介してファイルとナレッジコレクションを管理する方法と、それらをチャット補完で効果的に使用する方法について説明します。

#### ファイルのアップロード

RAG応答で外部データを利用するには、まずファイルをアップロードする必要があります。アップロードされたファイルの内容は自動的に抽出され、ベクターデータベースに保存されます。

- **エンドポイント**: `POST /api/v1/files/`
- **Curl例**:

  ```bash
  curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Accept: application/json" \
  -F "file=@/path/to/your/file" http://localhost:3000/api/v1/files/
  ```

- **Python例**:

  ```python
  import requests
  
  def upload_file(token, file_path):
      url = 'http://localhost:3000/api/v1/files/'
      headers = {
          'Authorization': f'Bearer {token}',
          'Accept': 'application/json'
      }
      files = {'file': open(file_path, 'rb')}
      response = requests.post(url, headers=headers, files=files)
      return response.json()
  ```

#### ナレッジコレクションへのファイルの追加

アップロード後、ファイルをナレッジコレクションにグループ化したり、個別にチャットで参照したりできます。

- **エンドポイント**: `POST /api/v1/knowledge/{id}/file/add`
- **Curl例**:

  ```bash
  curl -X POST http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"file_id": "your-file-id-here"}'
  ```

- **Python例**:

  ```python
  import requests

  def add_file_to_knowledge(token, knowledge_id, file_id):
      url = f'http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      data = {'file_id': file_id}
      response = requests.post(url, headers=headers, json=data)
      return response.json()
  ```

#### ファイルとコレクションをチャット補完で使用する

個別のファイルまたはコレクション全体を参照することで、RAGクエリの応答を充実させることができます。

##### 個別ファイルをチャット補完で使用する

特定のファイルの内容に焦点を当てた応答を得たい場合に有効な方法です。

- **エンドポイント**: `POST /api/chat/completions`
- **Curl例**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4-turbo",
        "messages": [
          {"role": "user", "content": "この文書の概念を説明してください。"}
        ],
        "files": [
          {"type": "file", "id": "your-file-id-here"}
        ]
      }'
  ```

- **Python例**:

  ```python
  import requests

  def chat_with_file(token, model, query, file_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'file', 'id': file_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

##### ナレッジコレクションをチャット補完で使用する

より広範な文脈や複数のドキュメントから恩恵を得られる問い合わせの場合、ナレッジコレクションを活用して応答を強化できます。

- **エンドポイント**: `POST /api/chat/completions`
- **Curl例**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4-turbo",
        "messages": [
          {"role": "user", "content": "このコレクションでカバーされている歴史的観点についての洞察を提供してください。"}
        ],
        "files": [
          {"type": "collection", "id": "your-collection-id-here"}
        ]
      }'
  ```

- **Python例**:

  ```python
  import requests
  
  def chat_with_collection(token, model, query, collection_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'collection', 'id': collection_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

これらの方法により、アップロードしたファイルとキュレーションされたナレッジコレクションを活用して外部知識を効果的に利用でき、Sage WebUI APIを使用したチャットアプリケーションの機能を強化できます。ファイルを個別に使用する場合もコレクション内で使用する場合も、特定のニーズに基づいて統合をカスタマイズできます。

## Sage WebUIを統合LLMプロバイダーとして使用する利点

Sage WebUIは、開発者や企業にとって不可欠なツールとなる数多くの利点を提供します：

- **統一インターフェース**: さまざまなLLMとのやり取りを単一の統合プラットフォームで簡素化。
- **実装の容易さ**: 包括的なドキュメントとコミュニティサポートによる迅速なスタート。

## Swaggerドキュメントリンク

:::important
これらのサービスのSwaggerドキュメントにアクセスするには、`ENV`環境変数を`dev`に設定してください。この設定がないと、ドキュメントは利用できません。
:::

Sage WebUIが提供するさまざまなサービスの詳細なAPIドキュメントにアクセス：

| Application | Documentation Path      |
|-------------|-------------------------|
| Main        | `/docs`                 |

これらのガイドラインに従うことで、Sage WebUI APIを迅速に統合し、利用を開始できます。問題が発生した場合や質問がある場合は、Discordコミュニティまでお気軽にお問い合わせいただくか、FAQを参照してください。コーディングを楽しんでください！ 🌟