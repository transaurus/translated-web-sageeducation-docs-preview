---
sidebar_position: 5
title: "🔗 URL Parameters"
---

Sage WebUIでは、チャットセッションをさまざまなURLパラメータを通じてカスタマイズできます。これらのパラメータを使用すると、特定の設定を適用したり、機能を有効にしたり、モデル設定をチャットごとに定義したりできます。このアプローチにより、URLから直接個々のチャットセッションを柔軟に制御できます。

## URLパラメータの概要

以下の表は、利用可能なURLパラメータ、その機能、および使用例を示しています。

| **Parameter**      | **Description**                                                                  | **Example**                          |
|-----------------------|----------------------------------------------------------------------------------|--------------------------------------------------------|
| `models`           | Specifies the models to be used, as a comma-separated list.                     | `/?models=model1,model2`         |
| `model`            | Specifies a single model to be used for the chat session.                       | `/?model=model1`                 |
| `youtube`          | Specifies a YouTube video ID to be transcribed within the chat.                 | `/?youtube=VIDEO_ID`             |
| `web-search`       | Enables web search functionality if set to `true`.                              | `/?web-search=true`              |
| `tools` or `tool-ids` | Specifies a comma-separated list of tool IDs to activate in the chat.          | `/?tools=tool1,tool2`            |
| `call`             | Enables a call overlay if set to `true`.                                        | `/?call=true`                    |
| `q`                | Sets an initial query or prompt for the chat.                                   | `/?q=Hello%20there`              |
| `temporary-chat`   | Marks the chat as temporary if set to `true`, for one-time sessions.            | `/?temporary-chat=true`          |

### 1. **モデルとモデル選択**

- **説明**: `models`および`model`パラメータを使用すると、特定のチャットセッションで使用する[言語モデル](/features/workspace/models.md)を指定できます。
- **設定方法**: 複数のモデルを指定する場合は`models`、単一のモデルを指定する場合は`model`を使用します。
- **例**:
  - `/?models=model1,model2` – これにより、`model1`と`model2`を使用してチャットが初期化されます。
  - `/?model=model1` – これにより、`model1`がチャットの唯一のモデルとして設定されます。

### 2. **YouTube文字起こし**

- **説明**: `youtube`パラメータにはYouTube動画IDを指定でき、指定された動画の文字起こしをチャットで有効にします。
- **設定方法**: このパラメータの値としてYouTube動画IDを使用します。
- **例**: `/?youtube=VIDEO_ID`
- **動作**: これにより、指定されたYouTube動画の文字起こし機能がチャット内でトリガーされます。

### 3. **ウェブ検索**

- **説明**: `web-search`を有効にすると、チャットセッションで[ウェブ検索](/category/-web-search)機能を利用できます。
- **設定方法**: このパラメータを`true`に設定してウェブ検索を有効にします。
- **例**: `/?web-search=true`
- **動作**: 有効にすると、チャットは応答の一部としてウェブ検索結果を取得できます。

### 4. **ツール選択**

- **説明**: `tools`または`tool-ids`パラメータを使用すると、チャット内で有効にする[ツール](/features/plugin/tools)を指定できます。
- **設定方法**: パラメータの値としてツールIDのカンマ区切りリストを指定します。
- **例**: `/?tools=tool1,tool2` または `/?tool-ids=tool1,tool2`
- **動作**: 各ツールIDがセッション内でマッチングされ、ユーザー操作のために有効化されます。

### 5. **通話オーバーレイ**

- **説明**: `call`パラメータを使用すると、チャットインターフェースにビデオまたは通話オーバーレイを表示できます。
- **設定方法**: このパラメータを`true`に設定して通話オーバーレイを有効にします。
- **例**: `/?call=true`
- **動作**: 通話インターフェースオーバーレイが有効化され、ライブ文字起こしやビデオ入力などの機能が利用可能になります。

### 6. **初期クエリプロンプト**

- **説明**: `q`パラメータを使用すると、チャットの初期クエリまたはプロンプトを設定できます。
- **設定方法**: パラメータの値としてクエリまたはプロンプトテキストを指定します。
- **例**: `/?q=Hello%20there`
- **動作**: チャットは指定されたプロンプトで開始され、自動的に最初のメッセージとして送信されます。

### 7. **一時的なチャットセッション**

- **説明**: `temporary-chat`パラメータを使用すると、チャットを一時的なセッションとしてマークできます。これにより、チャット履歴の保存や永続的な設定の適用などの機能が制限される場合があります。
- **設定方法**: このパラメータを`true`に設定して一時的なチャットセッションを開始します。
- **例**: `/?temporary-chat=true`
- **動作**: これにより、履歴を保存せず、高度な設定を適用しない使い捨てのチャットセッションが開始されます。

<details>
<summary>Example Use Case</summary>
:::tip[**Temporary Chat Session**]
Suppose a user wants to initiate a quick chat session without saving the history. They can do so by setting `temporary-chat=true` in the URL. This provides a disposable chat environment ideal for one-time interactions.
:::
</details>

## 複数のパラメータを組み合わせて使用する

これらのURLパラメータを組み合わせることで、高度にカスタマイズされたチャットセッションを作成できます。例:

```bash
/chat?models=model1,model2&youtube=VIDEO_ID&web-search=true&tools=tool1,tool2&call=true&q=Hello%20there&temporary-chat=true
```

このURLは以下のことを行います:

- Initialize the chat with `model1` and `model2`.
- Enable YouTube transcription, web search, and specified tools.
- Display a call overlay.
- Set an initial prompt of "Hello there."
- Mark the chat as temporary, avoiding any history saving.