---
sidebar_position: 4
title: "🌍 Environment Variable Configuration"
---

## 概要

Sage WebUIは、アプリケーションのさまざまな側面をカスタマイズおよび設定できる幅広い環境変数を提供します。このページでは、利用可能なすべての環境変数について、そのタイプ、デフォルト値、説明を含む包括的なリファレンスを提供します。新しい変数が導入されるにつれて、このページは設定オプションの増加を反映するように更新されます。

:::info

このページはSage WebUIリリースバージョン[v0.5.1](https://github.com/Startr/AI-WEB-openwebui/releases/tag/v0.5.1)時点で最新ですが、環境変数の利用可能なオプションのリスト化、デフォルト値の記載、説明の改善など、より正確な記述を含めるために作業中です。

:::

### PersistentConfig環境変数に関する重要な注意

:::note

Sage WebUIを初めて起動する際、すべての環境変数は同等に扱われ、アプリケーションの設定に使用されます。ただし、`PersistentConfig`とマークされた環境変数については、その値が永続化され内部に保存されます。

初回起動後、コンテナを再起動すると、`PersistentConfig`環境変数は外部の環境変数値を使用しなくなります。代わりに、内部に保存された値が使用されます。

一方、通常の環境変数は、その後の再起動ごとに更新され適用され続けます。

`PersistentConfig`環境変数の値は、Sage WebUI内から直接更新でき、これらの変更は内部に保存されます。これにより、外部の環境変数とは独立してこれらの設定を管理できます。

なお、`PersistentConfig`環境変数は以下のドキュメントで明確にマークされているため、その動作を認識できます。

:::

## アプリ/バックエンド

以下の環境変数は、Sage WebUIの起動設定を提供するために`backend/open_webui/config.py`で使用されます。一部の変数は、Sage WebUIを直接実行するかDocker経由で実行するかによってデフォルト値が異なる場合があることに注意してください。ロギング環境変数の詳細については、[ロギングドキュメント](/getting-started/advanced-topics/logging)を参照してください。

### 一般

#### `ENV`

- タイプ: `str` (列挙型: `dev`, `prod`)
- オプション:
  - `dev` - `/docs`でFastAPI APIドキュメントを有効化
  - `prod` - 複数の環境変数を自動設定
- デフォルト:
  - **バックエンドデフォルト**: `dev`
  - **Dockerデフォルト**: `prod`
- 説明: 環境設定。

#### `CUSTOM_NAME`

- タイプ: `str`
- 説明: `WEBUI_NAME`を設定しますが、**api.openwebui.com**からメタデータをポーリングします。

#### `WEBUI_NAME`

- タイプ: `str`
- デフォルト: `Sage WebUI`
- 説明: メインのWebUI名を設定します。上書きされた場合、`(Sage WebUI)`を追加します。

#### `WEBUI_URL`

- タイプ: `str`
- デフォルト: `http://localhost:3000`
- 説明: Sage WebUIがアクセス可能なURLを指定します。現在は検索エンジンサポートに使用されています。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `PORT`

- タイプ: `int`
- デフォルト: `8080`
- 説明: Sage WebUIを実行するポートを設定します。

:::info
Pythonを使用してアプリケーションを実行し、`sage-open-webui serve`コマンドを使用している場合、`PORT`設定を使用してポートを設定することはできません。代わりに、`--port`フラグを使用してコマンドライン引数として直接指定する必要があります。例:

```bash
sage-open-webui serve --port 9999
```

これにより、Sage WebUIはポート`9999`で実行されます。このモードでは`PORT`環境変数は無視されます。
:::

#### `ENABLE_SIGNUP`

- タイプ: `bool`
- デフォルト: `True`
- 説明: ユーザーアカウント作成を切り替えます。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ENABLE_LOGIN_FORM`

- タイプ: `bool`
- デフォルト: `True`
- 説明: メール、パスワード、サインイン要素、および「または」（`ENABLE_OAUTH_SIGNUP`がTrueに設定されている場合のみ）要素の表示を切り替えます。
- 永続性: この環境変数は`PersistentConfig`変数です。

:::danger

この設定は、[ENABLE_OAUTH_SIGNUP](/getting-started/env-configuration/#enable_oauth_signup)も同時に使用され、`True`に設定されている場合にのみ`False`に設定してください。これに失敗すると、ログインが不可能になります。

:::

#### `ENABLE_REALTIME_CHAT_SAVE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 有効にすると、システムはストリーミングされるチャットデータの各チャンクをリアルタイムでデータベースに保存し、データの永続性を最大化します。この機能は堅牢なデータ復旧を提供し、正確なセッション追跡を可能にします。ただし、データベースへの保存による遅延が増加するというトレードオフがあります。この機能を無効にするとパフォーマンスが向上し遅延が減少しますが、システム障害やクラッシュ時のデータ損失リスクが生じます。アプリケーションの要件と許容可能なトレードオフに基づいて使用してください。

#### `ENABLE_ADMIN_EXPORT`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 管理者ユーザーがデータをエクスポートできるかどうかを制御します。

#### `ENABLE_ADMIN_CHAT_ACCESS`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 管理者ユーザーがすべてのチャットにアクセスできるようにします。

#### `ENABLE_CHANNELS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: チャネルサポートを有効または無効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ADMIN_EMAIL`

- タイプ: `str`
- 説明: `SHOW_ADMIN_DETAILS`によって表示される管理者メールを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `SHOW_ADMIN_DETAILS`

- タイプ: `bool`
- デフォルト: `True`
- 説明: インターフェースに管理者ユーザーの詳細を表示するかどうかを切り替えます。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `BYPASS_MODEL_ACCESS_CONTROL`

- タイプ: `bool`
- デフォルト: `False`
- 説明: モデルアクセス制御をバイパスします。

#### `DEFAULT_MODELS`

- タイプ: `str`
- デフォルト: 空文字列（' '）、デフォルトでは`None`が設定されます
- 説明: デフォルトの言語モデルを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `DEFAULT_USER_ROLE`

- タイプ: `str` (列挙型: `pending`, `user`, `admin`)
- オプション:
  - `pending` - 新規ユーザーは管理者による手動承認待ち状態になります。
  - `user` - 新規ユーザーは自動的に通常ユーザー権限でアクティベートされます。
  - `admin` - 新規ユーザーは自動的に管理者権限でアクティベートされます。
- デフォルト: `pending`
- 説明: 新規ユーザーに割り当てられるデフォルトのロールを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `DEFAULT_LOCALE`

- タイプ: `str`
- デフォルト: `en`
- 説明: アプリケーションのデフォルトロケールを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `WEBHOOK_URL`

- タイプ: `str`
- 説明: Discord/Slack/Microsoft Teamsとの連携用ウェブフックを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `WEBUI_BUILD_HASH`

- タイプ: `str`
- デフォルト: `dev-build`
- 説明: リリース用のビルドのGit SHAを識別するために使用されます。

#### `WEBUI_BANNERS`

- タイプ: `dict` の `list`
- デフォルト: `[]`
- 説明: ユーザーに表示するバナーのリスト。バナーのフォーマットは以下の通り:

```json
[{"id": "string","type": "string [info, success, warning, error]","title": "string","content": "string","dismissible": False,"timestamp": 1000}]
```

- 永続性: この環境変数は `PersistentConfig` 変数です。

:::info

.env ファイルでこの環境変数を設定する場合、内側の引用符をエスケープ (`\"`) し、全体を二重引用符で囲む必要があります。例:

```
WEBUI_BANNERS="[{\"id\": \"1\", \"type\": \"warning\", \"title\": \"Your messages are stored.\", \"content\": \"Your messages are stored and may be reviewed by human people. LLM's are prone to hallucinations, check sources.\", \"dismissible\": true, \"timestamp\": 1000}]"
```

:::

#### `JWT_EXPIRES_IN`

- タイプ: `int`
- デフォルト: `-1`
- 説明: JWTの有効期限を秒単位で設定します。有効な時間単位: `s`, `m`, `h`, `d`, `w` または `-1` (無期限)。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USE_CUDA_DOCKER`

- タイプ: `bool`
- デフォルト: `False`
- 説明: NVIDIA CUDAサポート付きでDockerイメージをビルドします。ローカルのWhisperおよび埋め込み処理にGPUアクセラレーションを有効化します。

### AIOHTTP クライアント

#### `AIOHTTP_CLIENT_TIMEOUT`

- タイプ: `int`
- デフォルト: `300`
- 説明: aiohttpクライアントのタイムアウト時間を秒単位で指定します。OllamaやOpenAIエンドポイントへの接続などに影響します。

:::info

これはクライアントが応答を待つ最大時間です。空文字列 (' ') に設定すると、タイムアウトが `None` に設定され、クライアントは無期限に待機します。

:::

#### `AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST`

- タイプ: `int`
- 説明: モデルリストの取得におけるタイムアウト時間を秒単位で設定します。ネットワーク遅延によりモデルリストの取得に時間がかかる場合に有用です。

#### `AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST`

- タイプ: `int`
- 説明: モデルリストの取得におけるタイムアウト時間を秒単位で設定します。ネットワーク遅延によりモデルリストの取得に時間がかかる場合に有用です。

### ディレクトリ

#### `DATA_DIR`

- タイプ: `str`
- デフォルト: `./data`
- 説明: アップロードファイル、キャッシュ、ベクターデータベースなどのデータ保存用ベースディレクトリを指定します。

#### `FONTS_DIR`

- タイプ: `str`
- 説明: フォント用ディレクトリを指定します。

#### `FRONTEND_BUILD_DIR`

- タイプ: `str`
- デフォルト: `../build`
- 説明: ビルド済みフロントエンドファイルの場所を指定します。

#### `STATIC_DIR`

- タイプ: `str`
- デフォルト: `./static`
- 説明: ファビコンなどの静的ファイル用ディレクトリを指定します。

### Ollama

#### `ENABLE_OLLAMA_API`

- タイプ: `bool`
- デフォルト: `True`
- 説明: Ollama APIの使用を有効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `OLLAMA_BASE_URL` (`OLLAMA_API_BASE_URL` は非推奨) {#ollama_base_url}

- タイプ: `str`
- デフォルト: `http://localhost:11434`
- Dockerデフォルト:
  - `K8S_FLAG`が設定されている場合: `http://ollama-service.sage-open-webui.svc.cluster.local:11434`
  - `USE_OLLAMA_DOCKER=True`の場合: `http://localhost:11434`
  - それ以外: `http://host.docker.internal:11434`
- 説明: OllamaバックエンドのURLを設定します。

#### `OLLAMA_BASE_URLS`

- タイプ: `str`
- 説明: ロードバランシング用のOllamaバックエンドホストを`;`で区切って設定します。[`OLLAMA_BASE_URL`](#ollama_base_url)よりも優先されます。
- 例: `http://host-one:11434;http://host-two:11434`
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `USE_OLLAMA_DOCKER`

- タイプ: `bool`
- デフォルト: `False`
- 説明: OllamaインスタンスをバンドルしたDockerイメージをビルドします。

#### `K8S_FLAG`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 設定されている場合、Helmチャートデプロイメントを想定し、[`OLLAMA_BASE_URL`](#ollama_base_url)を`http://ollama-service.sage-open-webui.svc.cluster.local:11434`に設定します。

### OpenAI

#### `ENABLE_OPENAI_API`

- タイプ: `bool`
- デフォルト: `True`
- 説明: OpenAI APIの使用を有効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OPENAI_API_BASE_URL`

- タイプ: `str`
- デフォルト: `https://api.openai.com/v1`
- 説明: OpenAIベースAPIのURLを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OPENAI_API_BASE_URLS`

- タイプ: `str`
- 説明: ロードバランシング用のOpenAIベースAPI URLをセミコロンで区切って設定します。
- 例: `http://host-one:11434;http://host-two:11434`
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OPENAI_API_KEY`

- タイプ: `str`
- 説明: OpenAI APIキーを設定します。
- 例: `sk-124781258123`
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OPENAI_API_KEYS`

- タイプ: `str`
- 説明: 複数のOpenAI APIキーをセミコロンで区切って設定します。
- 例: `sk-124781258123;sk-4389759834759834`
- 永続性: この環境変数は`PersistentConfig`変数です。

### タスク

#### `TASK_MODEL`

- タイプ: `str`
- 説明: Ollamaモデルを使用する際の、タイトルやWeb検索クエリ生成などのタスクに使用するデフォルトモデル。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `TASK_MODEL_EXTERNAL`

- タイプ: `str`
- 説明: OpenAI互換エンドポイントを使用する際の、タイトルやWeb検索クエリ生成などのタスクに使用するデフォルトモデル。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `TITLE_GENERATION_PROMPT_TEMPLATE`

- タイプ: `str`
- 説明: チャットタイトル生成時に使用するプロンプト。
- デフォルト: `DEFAULT_TITLE_GENERATION_PROMPT_TEMPLATE`環境変数の値。

テンプレート:

```
### Task:
Generate a concise, 3-5 word title with an emoji summarizing the chat history.
### Guidelines:
- The title should clearly represent the main theme or subject of the conversation.
- Use emojis that enhance understanding of the topic, but avoid quotation marks or special formatting.
- Write the title in the chat's primary language; default to English if multilingual.
- Prioritize accuracy over excessive creativity; keep it clear and simple.
### Output:
JSON format: { "title": "your concise title here" }
### Examples:
- { "title": "📉 Stock Market Trends" },
- { "title": "🍪 Perfect Chocolate Chip Recipe" },
- { "title": "Evolution of Music Streaming" },
- { "title": "Remote Work Productivity Tips" },
- { "title": "Artificial Intelligence in Healthcare" },
- { "title": "🎮 Video Game Development Insights" }
### Chat History:
<chat_history>
{{MESSAGES:END:2}}
</chat_history>
```

- 永続性: この環境変数は`PersistentConfig`変数です。

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- タイプ: `str`
- 説明: ツール呼び出し時に使用するプロンプト
- デフォルト: `DEFAULT_TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE` 環境変数の値

テンプレート:

```
Available Tools: {{TOOLS}}\nReturn an empty string if no tools match the query. If a function tool matches, construct and return a JSON object in the format {\"name\": \"functionName\", \"parameters\": {\"requiredFunctionParamKey\": \"requiredFunctionParamValue\"}} using the appropriate tool and its parameters. Only return the object and limit the response to the JSON object without additional text.
```

- 永続性: この環境変数は `PersistentConfig` 変数です

### オートコンプリート

#### `ENABLE_AUTOCOMPLETE_GENERATION`

- タイプ: `bool`
- デフォルト: `True`
- 説明: オートコンプリート生成を有効/無効にする
- 永続性: この環境変数は `PersistentConfig` 変数です

:::info

`ENABLE_AUTOCOMPLETE_GENERATION` を有効にする場合、`AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH` と `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE` も適切に設定してください

:::

#### `AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH`

- タイプ: `int`
- デフォルト: `-1`
- 説明: オートコンプリート生成の最大入力長を設定
- 永続性: この環境変数は `PersistentConfig` 変数です

#### `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE`

- タイプ: `str`
- デフォルト: `DEFAULT_AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE` 環境変数の値

テンプレート:

```
### Task:
You are an autocompletion system. Continue the text in `<text>` based on the **completion type** in `<type>` and the given language.  

### **Instructions**:
1. Analyze `<text>` for context and meaning.  
2. Use `<type>` to guide your output:  
   - **General**: Provide a natural, concise continuation.  
   - **Search Query**: Complete as if generating a realistic search query.  
3. Start as if you are directly continuing `<text>`. Do **not** repeat, paraphrase, or respond as a model. Simply complete the text.  
4. Ensure the continuation:
   - Flows naturally from `<text>`.  
   - Avoids repetition, overexplaining, or unrelated ideas.  
5. If unsure, return: `{ "text": "" }`.  

### **Output Rules**:
- Respond only in JSON format: `{ "text": "<your_completion>" }`.

### **Examples**:
#### Example 1:  
Input:  
<type>General</type>  
<text>The sun was setting over the horizon, painting the sky</text>  
Output:  
{ "text": "with vibrant shades of orange and pink." }

#### Example 2:  
Input:  
<type>Search Query</type>  
<text>Top-rated restaurants in</text>  
Output:  
{ "text": "New York City for Italian cuisine." }  

---
### Context:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
<type>{{TYPE}}</type>  
<text>{{PROMPT}}</text>  
#### Output:
```

- 説明: オートコンプリート生成用のプロンプトテンプレートを設定
- 永続性: この環境変数は `PersistentConfig` 変数です

### 評価アリーナモデル

#### `ENABLE_EVALUATION_ARENA_MODELS`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 評価アリーナモデルを有効/無効にする
- 永続性: この環境変数は `PersistentConfig` 変数です

#### `ENABLE_MESSAGE_RATING`

- タイプ: `bool`
- デフォルト: `True`
- 説明: メッセージ評価機能を有効にする
- 永続性: この環境変数は `PersistentConfig` 変数です

#### `ENABLE_COMMUNITY_SHARING`

- タイプ: `bool`
- デフォルト: `True`
- 説明: ユーザーにコミュニティ共有ボタンを表示するかどうかを制御
- 永続性: この環境変数は `PersistentConfig` 変数です

### タグ生成

#### `ENABLE_TAGS_GENERATION`

- タイプ: `bool`
- デフォルト: `True`
- 説明: タグ生成を有効/無効にする
- 永続性: この環境変数は `PersistentConfig` 変数です

#### `TAGS_GENERATION_PROMPT_TEMPLATE`

- タイプ: `str`
- デフォルト: `DEFAULT_TAGS_GENERATION_PROMPT_TEMPLATE` 環境変数の値

テンプレート:

```
### Task:
Generate 1-3 broad tags categorizing the main themes of the chat history, along with 1-3 more specific subtopic tags.

### Guidelines:
- Start with high-level domains (e.g. Science, Technology, Philosophy, Arts, Politics, Business, Health, Sports, Entertainment, Education)
- Consider including relevant subfields/subdomains if they are strongly represented throughout the conversation
- If content is too short (less than 3 messages) or too diverse, use only ["General"]
- Use the chat's primary language; default to English if multilingual
- Prioritize accuracy over specificity

### Output:
JSON format: { "tags": ["tag1", "tag2", "tag3"] }

### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
```

- 説明: タグ生成用のプロンプトテンプレートを設定
- 永続性: この環境変数は `PersistentConfig` 変数です

### APIキーエンドポイント制限

#### `ENABLE_API_KEY_ENDPOINT_RESTRICTIONS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: セキュリティと設定性向上のため、APIキーエンドポイント制限を有効にする
- 永続性: この環境変数は `PersistentConfig` 変数です

#### `API_KEY_ALLOWED_ENDPOINTS`

- タイプ: `str`
- 説明: APIキーエンドポイント制限が有効な場合に許可されるAPIエンドポイントのカンマ区切りリストを指定
- 永続性: この環境変数は `PersistentConfig` 変数です

:::note

`API_KEY_ALLOWED_ENDPOINTS` の値は `/api/v1/messages, /api/v1/channels` のようなエンドポイントURLのカンマ区切りリストである必要があります

:::

## セキュリティ変数

#### `ENABLE_FORWARD_USER_INFO_HEADERS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ユーザー情報（名前、ID、メールアドレス、ロール）をXヘッダーとしてOpenAI APIおよびOllama APIに転送します。
有効にすると、以下のヘッダーが転送されます:
  - `X-OpenWebUI-User-Name`
  - `X-OpenWebUI-User-Id`
  - `X-OpenWebUI-User-Email`
  - `X-OpenWebUI-User-Role`

#### `ENABLE_RAG_LOCAL_WEB_FETCH`

- タイプ: `bool`
- デフォルト: `False`
- 説明: RAGのローカルウェブフェッチを有効にします。これを有効にすると、ローカルネットワークリソースに対するサーバーサイドリクエストフォージェリ攻撃が可能になります。

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- タイプ: `bool`
- デフォルト: `True`
- 説明: ウェブサイト上のRAGに対するSSL検証をバイパスします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `WEBUI_SESSION_COOKIE_SAME_SITE`

- タイプ: `str` (列挙型: `lax`, `strict`, `none`)
- オプション:
  - `lax` - `SameSite`属性をlaxに設定し、サードパーティのウェブサイトから開始されたリクエストでセッションクッキーを送信できるようにします。
  - `strict` - `SameSite`属性をstrictに設定し、サードパーティのウェブサイトから開始されたリクエストでセッションクッキーが送信されないようにします。
  - `none` - `SameSite`属性をnoneに設定し、HTTPS経由でのみ、サードパーティのウェブサイトから開始されたリクエストでセッションクッキーを送信できるようにします。
- デフォルト: `lax`
- 説明: セッションクッキーの`SameSite`属性を設定します。

:::warning

`ENABLE_OAUTH_SIGNUP`が有効な場合、`WEBUI_SESSION_COOKIE_SAME_SITE`を`strict`に設定するとログインが失敗する可能性があります。これは、Sage WebUIがOAuthプロバイダーからのコールバックを検証するためにセッションクッキーを使用しており、CSRF攻撃を防ぐためです。

しかし、`strict`セッションクッキーはコールバックリクエストと共に送信されないため、ログインの問題が発生する可能性があります。この問題が発生した場合は、デフォルトの`lax`値を使用してください。

:::

#### `WEBUI_SESSION_COOKIE_SECURE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: `True`に設定すると、セッションクッキーの`Secure`属性を設定します。

#### `WEBUI_AUTH_COOKIE_SAME_SITE`

- タイプ: `str` (列挙型: `lax`, `strict`, `none`)
- オプション:
  - `lax` - `SameSite`属性をlaxに設定し、サードパーティのウェブサイトから開始されたリクエストで認証クッキーを送信できるようにします。
  - `strict` - `SameSite`属性をstrictに設定し、サードパーティのウェブサイトから開始されたリクエストで認証クッキーが送信されないようにします。
  - `none` - `SameSite`属性をnoneに設定し、HTTPS経由でのみ、サードパーティのウェブサイトから開始されたリクエストで認証クッキーを送信できるようにします。
- デフォルト: `lax`
- 説明: 認証クッキーの`SameSite`属性を設定します。

:::info

値が設定されていない場合、`WEBUI_SESSION_COOKIE_SAME_SITE`がフォールバックとして使用されます。

:::

#### `WEBUI_AUTH_COOKIE_SECURE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: `True`に設定すると、認証クッキーの`Secure`属性を設定します。

:::info

値が設定されていない場合、`WEBUI_SESSION_COOKIE_SECURE`がフォールバックとして使用されます。

:::

#### `WEBUI_AUTH`

- タイプ: `bool`
- デフォルト: `True`
- 説明: この設定は認証を有効または無効にします。

:::danger

`False`に設定すると、Sage WebUIインスタンスの認証が無効になります。ただし、認証を無効にできるのは既存ユーザーがいない新規インストール時のみであることに注意してください。すでにユーザーが登録されている場合、直接認証を無効にすることはできません。`WEBUI_AUTH`を無効にする場合は、データベースにユーザーが存在しないことを確認してください。

:::

#### `WEBUI_SECRET_KEY`

- タイプ: `str`
- デフォルト: `t0p-s3cr3t`
- Dockerデフォルト: 初回起動時にランダム生成
- 説明: JSON Web Tokenに使用されるランダム生成文字列を上書きします。

#### `OFFLINE_MODE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: オフラインモードを有効/無効にします。

#### `RESET_CONFIG_ON_START`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 起動時に`config.json`ファイルをリセットします。

#### `SAFE_MODE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 安全モードを有効にし、潜在的に危険な機能を無効化して全ての機能を停止します。

#### `CORS_ALLOW_ORIGIN`

- タイプ: `str`
- デフォルト: `*`
- 説明: Cross-Origin Resource Sharing (CORS)で許可するオリジンを設定します。

#### `RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: Hubで独自のモデリングファイルに定義されたカスタムモデルを許可するかどうかを決定します。

#### `RAG_RERANKING_MODEL_TRUST_REMOTE_CODE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: リランキング用にHubで独自のモデリングファイルに定義されたカスタムモデルを許可するかどうかを決定します。

#### `RAG_EMBEDDING_MODEL_AUTO_UPDATE`

- タイプ: `bool`
- デフォルト: `True`
- 説明: Sentence-Transformerモデルの自動更新を切り替えます。

#### `RAG_RERANKING_MODEL_AUTO_UPDATE`

- タイプ: `bool`
- デフォルト: `True`
- 説明: リランキングモデルの自動更新を切り替えます。

#### `WHISPER_MODEL_AUTO_UPDATE`

- タイプ: `bool`
- デフォルト: `False`
- 説明: Whisperモデルの自動更新を切り替えます。

## Retrieval Augmented Generation (RAG)

#### `VECTOR_DB`

- タイプ: `str`
- オプション:
- `chroma`, `milvus`, `qdrant`, `opensearch`, `pgvector`
- デフォルト: `chroma`
- 説明: 使用するベクトルデータベースシステムを指定します。この設定は、埋め込みを管理するために使用されるベクトルストレージシステムを決定します。

#### `RAG_EMBEDDING_ENGINE`

- タイプ: `str` (enum: `ollama`, `openai`)
- オプション:
  - 空欄: `Default (SentenceTransformers)` - SentenceTransformersを使用
  - `ollama` - Ollama APIを使用
  - `openai` - OpenAI APIを使用
- 説明: RAGで使用する埋め込みエンジンを選択します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_EMBEDDING_MODEL`

- タイプ: `str`
- デフォルト: `sentence-transformers/all-MiniLM-L6-v2`
- 説明: 埋め込み用のモデルを設定します。ローカルではSentence-Transformerモデルが使用されます。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ENABLE_RAG_HYBRID_SEARCH`

- タイプ: `bool`
- デフォルト: `False`
- 説明: `BM25` + `ChromaDB`によるアンサンブル検索を有効にし、`sentence_transformers`モデルを使用した再ランキングを行います。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `CONTENT_EXTRACTION_ENGINE`

- タイプ: `str` (`tika`)
- オプション:
  - 空欄の場合はデフォルトを使用
  - `tika` - ローカルのApache Tikaサーバーを使用
- 説明: ドキュメントインジェストに使用するコンテンツ抽出エンジンを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_TOP_K`

- タイプ: `int`
- デフォルト: `3`
- 説明: RAG使用時に考慮するデフォルトの結果数を設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_RELEVANCE_THRESHOLD`

- タイプ: `float`
- デフォルト: `0.0`
- 説明: 再ランキングと共に使用する際のドキュメントの関連性閾値を設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_TEMPLATE`

- タイプ: `str`
- デフォルト: `DEFAULT_RAG_TEMPLATE`環境変数の値

テンプレート:

```
### Task:
Respond to the user query using the provided context, incorporating inline citations in the format [source_id] **only when the <source_id> tag is explicitly provided** in the context.

### Guidelines:
- If you don't know the answer, clearly state that.
- If uncertain, ask the user for clarification.
- Respond in the same language as the user's query.
- If the context is unreadable or of poor quality, inform the user and provide the best possible answer.
- If the answer isn't present in the context but you possess the knowledge, explain this to the user and provide the answer using your own understanding.
- **Only include inline citations using [source_id] when a <source_id> tag is explicitly provided in the context.**  
- Do not cite if the <source_id> tag is not provided in the context.  
- Do not use XML tags in your response.
- Ensure citations are concise and directly related to the information provided.

### Example of Citation:
If the user asks about a specific topic and the information is found in "whitepaper.pdf" with a provided <source_id>, the response should include the citation like so:  
* "According to the study, the proposed method increases efficiency by 20% [whitepaper.pdf]."
If no <source_id> is present, the response should omit the citation.

### Output:
Provide a clear and direct response to the user's query, including inline citations in the format [source_id] only when the <source_id> tag is present in the context.

<context>
{{CONTEXT}}
</context>

<user_query>
{{QUERY}}
</user_query>
```

- 説明: チャット補完にRAGドキュメントを注入する際に使用するテンプレート
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_TEXT_SPLITTER`

- タイプ: `str`
- オプション: `character`, `token`
- デフォルト: `character`
- 説明: RAGモデルのテキストスプリッターを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `TIKTOKEN_CACHE_DIR`

- タイプ: `str`
- デフォルト: `{CACHE_DIR}/tiktoken`
- 説明: TikiTokenキャッシュのディレクトリを設定します。

#### `TIKTOKEN_ENCODING_NAME`

- タイプ: `str`
- デフォルト: `cl100k_base`
- 説明: TikiTokenのエンコーディング名を設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `CHUNK_SIZE`

- タイプ: `int`
- デフォルト: `1000`
- 説明: 埋め込み用のドキュメントチャンクサイズを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `CHUNK_OVERLAP`

- タイプ: `int`
- デフォルト: `100`
- 説明: チャンク間のオーバーラップ量を指定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `PDF_EXTRACT_IMAGES`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ドキュメント読み込み時にOCRを使用してPDFから画像を抽出します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_FILE_MAX_SIZE`

- タイプ: `int`
- 説明: ドキュメントインジェスト用にアップロード可能なファイルの最大サイズ（メガバイト単位）を設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_FILE_MAX_COUNT`

- タイプ: `int`
- 説明: ドキュメントインジェスト用に一度にアップロード可能なファイルの最大数を設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

:::info

`RAG_FILE_MAX_SIZE`と`RAG_FILE_MAX_COUNT`を設定する際は、過剰なファイルアップロードやパフォーマンス問題を防ぐため、適切な値を設定してください。

:::

#### `RAG_RERANKING_MODEL`

- タイプ: `str`
- 説明: 結果の再ランキングに使用するモデルを設定します。ローカルではSentence-Transformerモデルが使用されます。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_OPENAI_API_BASE_URL`

- タイプ: `str`
- デフォルト: `${OPENAI_API_BASE_URL}`
- 説明: RAGエンベッディングに使用するOpenAIベースAPI URLを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_OPENAI_API_KEY`

- タイプ: `str`
- デフォルト: `${OPENAI_API_KEY}`
- 説明: RAGエンベッディングに使用するOpenAI APIキーを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_EMBEDDING_OPENAI_BATCH_SIZE`

- タイプ: `int`
- デフォルト: `1`
- 説明: OpenAIエンベッディングのバッチサイズを設定します。

#### `RAG_EMBEDDING_BATCH_SIZE`

- タイプ: `int`
- デフォルト: `1`
- 説明: RAG（Retrieval-Augmented Generator）モデルのエンベッディングバッチサイズを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_OLLAMA_API_KEY`

- タイプ: `str`
- 説明: RAGモデルで使用するOllama APIのAPIキーを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `RAG_OLLAMA_BASE_URL`

- タイプ: `str`
- 説明: RAGモデルで使用するOllama APIのベースURLを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ENABLE_RETRIEVAL_QUERY_GENERATION`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 検索クエリ生成を有効または無効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `QUERY_GENERATION_PROMPT_TEMPLATE`

- タイプ: `str`
- デフォルト: `DEFAULT_QUERY_GENERATION_PROMPT_TEMPLATE`環境変数の値。

テンプレート:

```
### Task:
Analyze the chat history to determine the necessity of generating search queries, in the given language. By default, **prioritize generating 1-3 broad and relevant search queries** unless it is absolutely certain that no additional information is required. The aim is to retrieve comprehensive, updated, and valuable information even with minimal uncertainty. If no search is unequivocally needed, return an empty list.

### Guidelines:
- Respond **EXCLUSIVELY** with a JSON object. Any form of extra commentary, explanation, or additional text is strictly prohibited.
- When generating search queries, respond in the format: { "queries": ["query1", "query2"] }, ensuring each query is distinct, concise, and relevant to the topic.
- If and only if it is entirely certain that no useful results can be retrieved by a search, return: { "queries": [] }.
- Err on the side of suggesting search queries if there is **any chance** they might provide useful or updated information.
- Be concise and focused on composing high-quality search queries, avoiding unnecessary elaboration, commentary, or assumptions.
- Today's date is: {{CURRENT_DATE}}.
- Always prioritize providing actionable and broad queries that maximize informational coverage.

### Output:
Strictly return in JSON format: 
{
  "queries": ["query1", "query2"]
}

### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
```

- 説明: クエリ生成用のプロンプトテンプレートを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

### Apache Tika

#### `TIKA_SERVER_URL`

- タイプ: `str`
- デフォルト: `http://localhost:9998`
- 説明: Apache TikaサーバーのURLを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

### ChromaDB

#### `CHROMA_TENANT`

- タイプ: `str`
- デフォルト: `chromadb.DEFAULT_TENANT`の値（`chromadb`モジュールの定数）
- 説明: RAGエンベッディングに使用するChromaDBのテナントを設定します。

#### `CHROMA_DATABASE`

- タイプ: `str`
- デフォルト: `chromadb.DEFAULT_DATABASE`の値（`chromadb`モジュールの定数）
- 説明: RAGエンベッディングに使用するChromaDBテナント内のデータベースを設定します。

#### `CHROMA_HTTP_HOST`

- タイプ: `str`
- 説明: リモートChromaDBサーバーのホスト名を指定します。設定されていない場合はローカルのChromaDBインスタンスが使用されます。

#### `CHROMA_HTTP_PORT`

- タイプ: `int`
- デフォルト: `8000`
- 説明: リモートChromaDBサーバーのポートを指定します。

#### `CHROMA_HTTP_HEADERS`

- タイプ: `str`
- 説明: ChromaDBリクエストごとに含めるHTTPヘッダーのカンマ区切りリスト。
- 例: `Authorization=Bearer heuhagfuahefj,User-Agent=OpenWebUI`。

#### `CHROMA_HTTP_SSL`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ChromaDBサーバー接続でSSLを使用するかどうかを制御します。

#### `CHROMA_CLIENT_AUTH_PROVIDER`

- タイプ: `str`
- 説明: リモートChromaDBサーバーの認証プロバイダーを指定します。
- 例: `chromadb.auth.basic_authn.BasicAuthClientProvider`

#### `CHROMA_CLIENT_AUTH_CREDENTIALS`

- タイプ: `str`
- 説明: リモートChromaDBサーバーの認証資格情報を指定します。
- 例: `username:password`

### Google Drive

#### `ENABLE_GOOGLE_DRIVE_INTEGRATION`

- タイプ: `bool`
- デフォルト: `False`
- 説明: Google Drive統合を有効または無効にします。trueに設定され、かつ`GOOGLE_DRIVE_CLIENT_ID`と`GOOGLE_DRIVE_API_KEY`の両方が構成されている場合、Google DriveがチャットUIのアップロードオプションとして表示されます。
- 永続性: この環境変数は`PersistentConfig`変数です。

:::info

`GOOGLE_DRIVE_INTEGRATION`を有効にする場合は、`GOOGLE_DRIVE_CLIENT_ID`と`GOOGLE_DRIVE_API_KEY`が正しく構成されていること、およびGoogleの利用規約と使用ガイドラインを確認していることを確認してください。

:::

#### `GOOGLE_DRIVE_CLIENT_ID`

- タイプ: `str`
- 説明: Google DriveのクライアントIDを設定します（クライアントはDrive APIとPicker APIが有効な状態で構成されている必要があります）。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `GOOGLE_DRIVE_API_KEY`

- タイプ: `str`
- 説明: Google Drive統合のAPIキーを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

### Milvus

#### `MILVUS_URI`

- タイプ: `str`
- デフォルト: `${DATA_DIR}/vector_db/milvus.db`
- 説明: Milvusベクターデータベースへの接続URIを指定します。これは、デプロイ構成に基づいてローカルまたはリモートのMilvusサーバーを指すことができます。

#### `MILVUS_DB`

- タイプ: `str`
- デフォルト: `default`
- 説明: Milvusインスタンス内で接続するデータベースを指定します。

#### `MILVUS_TOKEN`

- タイプ: `str`
- デフォルト: `None`
- 説明: Milvusの接続トークンを指定します（オプション）。

### OpenSearch

#### `OPENSEARCH_CERT_VERIFY`

- タイプ: `bool`
- デフォルト: `False`
- 説明: OpenSearchの証明書検証を有効または無効にします。

#### `OPENSEARCH_PASSWORD`

- タイプ: `str`
- 説明: OpenSearchのパスワードを設定します。

#### `OPENSEARCH_SSL`

- タイプ: `bool`
- デフォルト: `True`
- 説明: OpenSearchのSSLを有効または無効にします。

#### `OPENSEARCH_URI`

- タイプ: `str`
- デフォルト: `https://localhost:9200`
- 説明: OpenSearchのURIを設定します。

#### `OPENSEARCH_USERNAME`

- タイプ: `str`
- 説明: OpenSearchのユーザー名を設定します。

### PGVector

#### `PGVECTOR_DB_URL`

- タイプ: `str`
- デフォルト: `DATABASE_URL` 環境変数の値
- 説明: モデルストレージ用のデータベースURLを設定します。

### Qdrant

#### `QDRANT_API_KEY`

- タイプ: `str`
- 説明: QdrantのAPIキーを設定します。

#### `QDRANT_URI`

- タイプ: `str`
- 説明: QdrantのURIを設定します。

## Web検索

#### `ENABLE_RAG_WEB_SEARCH`

- タイプ: `bool`
- デフォルト: `False`
- 説明: Web検索のトグルを有効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `ENABLE_SEARCH_QUERY_GENERATION`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 検索クエリの生成を有効または無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `RAG_WEB_SEARCH_RESULT_COUNT`

- タイプ: `int`
- デフォルト: `3`
- 説明: クロールする検索結果の最大数。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `RAG_WEB_SEARCH_CONCURRENT_REQUESTS`

- タイプ: `int`
- デフォルト: `10`
- 説明: 検索結果から返されたWebページをクロールするための同時リクエスト数。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `RAG_WEB_SEARCH_ENGINE`

- タイプ: `str` (列挙型: `searxng`, `google_pse`, `brave`, `kagi`, `mojeek`, `serpstack`, `serper`, `serply`, `searchapi`, `duckduckgo`, `tavily`, `jina`, `bing`)
- オプション:
  - `searxng` - [SearXNG](https://github.com/searxng/searxng) 検索エンジンを使用します。
  - `google_pse` - [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/) を使用します。
  - `brave` - [Brave検索エンジン](https://brave.com/search/api/) を使用します。
  - `kagi` - [Kagi](https://www.kagi.com/) 検索エンジンを使用します。
  - `mojeek` - [Mojeek](https://www.mojeek.com/) 検索エンジンを使用します。
  - `serpstack` - [Serpstack](https://serpstack.com/) 検索エンジンを使用します。
  - `serper` - [Serper](https://serper.dev/) 検索エンジンを使用します。
  - `serply` - [Serply](https://serply.io/) 検索エンジンを使用します。
  - `searchapi` - [SearchAPI](https://www.searchapi.io/) 検索エンジンを使用します。
  - `duckduckgo` - [DuckDuckGo](https://duckduckgo.com/) 検索エンジンを使用します。
  - `tavily` - [Tavily](https://tavily.com/) 検索エンジンを使用します。
  - `jina` - [Jina](https://jina.ai/) 検索エンジンを使用します。
  - `bing` - [Bing](https://www.bing.com/) 検索エンジンを使用します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SEARXNG_QUERY_URL`

- タイプ: `str`
- 説明: JSON出力をサポートする[SearXNG検索API](https://docs.searxng.org/dev/search_api.html)のURL。`<query>`は検索クエリに置き換えられます。例: `http://searxng.local/search?q=<query>`
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `GOOGLE_PSE_API_KEY`

- タイプ: `str`
- 説明: Google Programmable Search Engine (PSE) サービスのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `GOOGLE_PSE_ENGINE_ID`

- タイプ: `str`
- 説明: Google Programmable Search Engine (PSE) サービスのエンジンIDです。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `BRAVE_SEARCH_API_KEY`

- タイプ: `str`
- 説明: Brave Search APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `KAGI_SEARCH_API_KEY`

- タイプ: `str`
- 説明: Kagi Search APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `MOJEEK_SEARCH_API_KEY`

- タイプ: `str`
- 説明: Mojeek Search APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SERPSTACK_API_KEY`

- タイプ: `str`
- 説明: Serpstack検索APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SERPSTACK_HTTPS`

- タイプ: `bool`
- デフォルト: `True`
- 説明: SerpstackリクエストでのHTTPSの使用を設定します。無料プランではHTTPのみに制限されます。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SERPER_API_KEY`

- タイプ: `str`
- 説明: Serper検索APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SERPLY_API_KEY`

- タイプ: `str`
- 説明: Serply検索APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SEARCHAPI_API_KEY`

- タイプ: `str`
- 説明: SearchAPIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `SEARCHAPI_ENGINE`

- タイプ: `str`
- 説明: SearchAPIのエンジンを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `TAVILY_API_KEY`

- タイプ: `str`
- 説明: Tavily検索APIのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `JINA_API_KEY`

- タイプ: `str`
- 説明: JinaのAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `BING_SEARCH_V7_ENDPOINT`

- タイプ: `str`
- 説明: Bing Search APIのエンドポイントを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `BING_SEARCH_V7_SUBSCRIPTION_KEY`

- タイプ: `str`
- デフォルト: `https://api.bing.microsoft.com/v7.0/search`
- 説明: Bing Search APIのサブスクリプションキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### YouTube Loader

#### `YOUTUBE_LOADER_PROXY_URL`

- タイプ: `str`
- 説明: YouTubeローダーのプロキシURLを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `YOUTUBE_LOADER_LANGUAGE`

- タイプ: `str`
- デフォルト: `en`
- 説明: YouTube動画の読み込みに使用する言語を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

## 音声

### Whisper 音声認識（ローカル）

#### `WHISPER_MODEL`

- タイプ: `str`
- デフォルト: `base`
- 説明: 音声認識に使用するWhisperモデルを設定します。バックエンドには `int8` 量子化されたfaster_whisperが使用されます。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `WHISPER_MODEL_DIR`

- タイプ: `str`
- デフォルト: `${DATA_DIR}/cache/whisper/models`
- 説明: Whisperモデルファイルを保存するディレクトリを指定します。

### 音声認識（OpenAI）

#### `AUDIO_STT_ENGINE`

- タイプ: `str` (列挙型: `openai`)
- オプション:
  - 空のままにすると、ローカルのWhisperエンジンが音声認識に使用されます。
  - `openai` - OpenAIエンジンを音声認識に使用します。
- 説明: 使用する音声認識エンジンを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_STT_MODEL`

- タイプ: `str`
- デフォルト: `whisper-1`
- 説明: OpenAI互換エンドポイントで使用する音声認識モデルを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_STT_OPENAI_API_BASE_URL`

- タイプ: `str`
- デフォルト: `${OPENAI_API_BASE_URL}`
- 説明: 音声認識に使用するOpenAI互換のベースURLを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_STT_OPENAI_API_KEY`

- タイプ: `str`
- デフォルト: `${OPENAI_API_KEY}`
- 説明: 音声認識に使用するOpenAI APIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### テキスト読み上げ

#### `AUDIO_TTS_API_KEY`

- タイプ: `str`
- 説明: テキスト読み上げに使用するAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_ENGINE`

- タイプ: `str` (列挙型: `azure`, `elevenlabs`, `openai`, `transformers`)
- オプション:
  - 空のままにすると、組み込みのWebAPIエンジンがテキスト読み上げに使用されます。
  - `azure` - Azureエンジンをテキスト読み上げに使用します。
  - `elevenlabs` - ElevenLabsエンジンをテキスト読み上げに使用します。
  - `openai` - OpenAIエンジンをテキスト読み上げに使用します。
  - `transformers` - SentenceTransformersをテキスト読み上げに使用します。
- 説明: 使用するテキスト読み上げエンジンを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_MODEL`

- タイプ: `str`
- デフォルト: `tts-1`
- 説明: 使用するOpenAIテキスト読み上げモデルを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### Azure テキスト読み上げ

#### `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT`

- タイプ: `str`
- 説明: Azureテキスト読み上げの出力フォーマットを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_AZURE_SPEECH_REGION`

- タイプ: `str`
- 説明: Azureテキスト読み上げのリージョンを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### OpenAI テキスト読み上げ

#### `AUDIO_TTS_OPENAI_API_BASE_URL`

- タイプ: `str`
- デフォルト: `${OPENAI_API_BASE_URL}`
- 説明: テキスト読み上げに使用するOpenAI互換のベースURLを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_OPENAI_API_KEY`

- タイプ: `str`
- デフォルト: `${OPENAI_API_KEY}`
- 説明: テキスト読み上げに使用するAPIキーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_SPLIT_ON`

- タイプ: `str`
- デフォルト: `punctuation`
- 説明: OpenAIテキスト読み上げで使用する分割方法を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUDIO_TTS_VOICE`

- タイプ: `str`
- デフォルト: `alloy`
- 説明: OpenAIテキスト読み上げで使用する音声を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

## 画像生成

#### `ENABLE_IMAGE_GENERATION`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 画像生成機能を有効または無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `IMAGE_GENERATION_ENGINE`

- タイプ: `str` (enum: `openai`, `comfyui`, `automatic1111`)
- オプション:
  - `openai` - OpenAI DALL-Eを使用して画像を生成します。
  - `comfyui` - ComfyUIエンジンを使用して画像を生成します。
  - `automatic1111` - Automatic1111エンジンを使用して画像を生成します（デフォルト）。
- デフォルト: `openai`
- 説明: 画像生成に使用するエンジンを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `IMAGE_GENERATION_MODEL`

- タイプ: `str`
- 説明: 画像生成に使用するデフォルトのモデル
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `IMAGE_SIZE`

- タイプ: `str`
- デフォルト: `512x512`
- 説明: 生成するデフォルトの画像サイズを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `IMAGE_STEPS`

- タイプ: `int`
- デフォルト: `50`
- 説明: 画像生成のデフォルトの反復ステップ数を設定します。ComfyUIおよびAUTOMATIC1111で使用されます。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### AUTOMATIC1111

#### `AUTOMATIC1111_API_AUTH`

- タイプ: `str`
- 説明: Automatic1111 APIの認証を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUTOMATIC1111_BASE_URL`

- タイプ: `str`
- 説明: Automatic1111のStable Diffusion APIへのURLを指定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUTOMATIC1111_CFG_SCALE`

- タイプ: `float`
- 説明: Automatic1111の推論スケールを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUTOMATIC1111_SAMPLER`

- タイプ: `str`
- 説明: Automatic1111の推論に使用するサンプラーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `AUTOMATIC1111_SCHEDULER`

- タイプ: `str`
- 説明: Automatic1111の推論に使用するスケジューラーを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

### ComfyUI

#### `COMFYUI_BASE_URL`

- タイプ: `str`
- 説明: ComfyUI画像生成APIのURLを指定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `COMFYUI_API_KEY`

- タイプ: `str`
- 説明: ComfyUIのAPIキーを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `COMFYUI_WORKFLOW`

- タイプ: `str`
- デフォルト:

```
{
  "3": {
    "inputs": {
      "seed": 0,
      "steps": 20,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": [
        "4",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "7",
        0
      ],
      "latent_image": [
        "5",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "4": {
    "inputs": {
      "ckpt_name": "model.safetensors"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Load Checkpoint"
    }
  },
  "5": {
    "inputs": {
      "width": 512,
      "height": 512,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage",
    "_meta": {
      "title": "Empty Latent Image"
    }
  },
  "6": {
    "inputs": {
      "text": "Prompt",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "7": {
    "inputs": {
      "text": "",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "3",
        0
      ],
      "vae": [
        "4",
        2
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "9": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "8",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  }
}
```

- 説明: ComfyUIのワークフローを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

### OpenAI DALL-E

#### `IMAGES_OPENAI_API_BASE_URL`

- タイプ: `str`
- デフォルト: `${OPENAI_API_BASE_URL}`
- 説明: DALL-E画像生成に使用するOpenAI互換のベースURLを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `IMAGES_OPENAI_API_KEY`

- タイプ: `str`
- デフォルト: `${OPENAI_API_KEY}`
- 説明: DALL-E画像生成に使用するAPIキーを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

## OAuth

#### `ENABLE_OAUTH_SIGNUP`

- タイプ: `bool`
- デフォルト: `False`
- 説明: OAuth経由でのサインアップ時にアカウント作成を有効にします。`ENABLE_SIGNUP`とは異なります。
- 永続性: この環境変数は`PersistentConfig`変数です。

:::danger

`ENABLE_OAUTH_SIGNUP`を`True`に設定する場合、`ENABLE_LOGIN_FORM`は`False`に設定する必要があります。これを怠るとログインできなくなります。

:::

#### `ENABLE_API_KEY`

- タイプ: `bool`
- デフォルト: `True`
- 説明: APIキー認証を有効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ENABLE_OAUTH_ROLE_MANAGEMENT`

- タイプ: `bool`
- デフォルト: `False`
- 説明: OAuth委任に対するロール管理を有効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `ENABLE_OAUTH_GROUP_MANAGEMENT`

- タイプ: `bool`
- デフォルト: `False`
- 説明: OAuthグループ管理を有効または無効にします。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- タイプ: `bool`
- デフォルト: `False`
- 説明: 有効にすると、同じメールアドレスを使用する既存のアカウントとOAuthアカウントを統合します。すべてのOAuthプロバイダーがメールアドレスを検証するわけではないため、これは安全ではなく、アカウントの乗っ取りにつながる可能性があります。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_USERNAME_CLAIM`

- タイプ: `str`
- デフォルト: `name`
- 説明: OpenIDのユーザー名クレームを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_EMAIL_CLAIM`

- タイプ: `str`
- デフォルト: `email`
- 説明: OpenIDのメールクレームを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_PICTURE_CLAIM`

- タイプ: `str`
- デフォルト: `picture`
- 説明: OpenIDの画像（アバター）クレームを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_GROUP_CLAIM`

- タイプ: `str`
- デフォルト: `groups`
- 説明: OAUTH認証のグループクレームを指定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_ROLES_CLAIM`

- タイプ: `str`
- デフォルト: `roles`
- 説明: OIDCトークン内で検索するロールクレームを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_SCOPES`

- タイプ: `str`
- デフォルト: `openid email profile`
- 説明: OIDC認証のスコープを設定します。`openid`と`email`は必須です。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_ALLOWED_DOMAINS`

- タイプ: `str`
- デフォルト: `*`
- 説明: OAUTH認証で許可されるドメインを指定します（例："example1.com,example2.com"）。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_ALLOWED_ROLES`

- タイプ: `str`
- デフォルト: `user,admin`
- 説明: プラットフォームへのアクセスが許可されるロールを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `OAUTH_ADMIN_ROLES`

- タイプ: `str`
- デフォルト: `admin`
- 説明: 管理者と見なされるロールを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- タイプ: `str`
- 説明: 認証用の信頼されたリクエストヘッダーを定義します。[SSOドキュメント](/features/sso)を参照してください。

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- タイプ: `str`
- 説明: `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`ヘッダーで登録するユーザーのユーザー名用の信頼されたリクエストヘッダーを定義します。[SSOドキュメント](/features/sso)を参照してください。

### Google

参照: https://support.google.com/cloud/answer/6158849?hl=en

#### `GOOGLE_CLIENT_ID`

- タイプ: `str`
- 説明: Google OAuthのクライアントIDを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `GOOGLE_CLIENT_SECRET`

- タイプ: `str`
- 説明: Google OAuthのクライアントシークレットを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `GOOGLE_OAUTH_SCOPE`

- タイプ: `str`
- デフォルト: `openid email profile`
- 説明: Google OAuth認証のスコープを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `GOOGLE_REDIRECT_URI`

- タイプ: `str`
- デフォルト: `<backend>/oauth/google/callback`
- 説明: Google OAuthのリダイレクトURIを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

### Microsoft

参照: https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app

#### `MICROSOFT_CLIENT_ID`

- タイプ: `str`
- 説明: Microsoft OAuthのクライアントIDを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `MICROSOFT_CLIENT_SECRET`

- タイプ: `str`
- 説明: Microsoft OAuthのクライアントシークレットを設定します。
- 永続性: この環境変数は`PersistentConfig`変数です。

#### `MICROSOFT_CLIENT_TENANT_ID`

- タイプ: `str`
- 説明: Microsoft OAuthのテナントIDを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `MICROSOFT_OAUTH_SCOPE`

- タイプ: `str`
- デフォルト: `openid email profile`
- 説明: Microsoft OAuth認証のスコープを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `MICROSOFT_REDIRECT_URI`

- タイプ: `str`
- デフォルト: `<backend>/oauth/microsoft/callback`
- 説明: Microsoft OAuthのリダイレクトURIを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

### Github

参照: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

#### `GITHUB_CLIENT_ID`

- タイプ: `str`
- 説明: Github OAuthのクライアントIDを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `GITHUB_CLIENT_SECRET`

- タイプ: `str`
- 説明: Github OAuthのクライアントシークレットを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `GITHUB_OAUTH_SCOPE`

- タイプ: `str`
- デフォルト: `user:email`
- 説明: Github OAuth認証のスコープを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `GITHUB_CLIENT_REDIRECT_URI`

- タイプ: `str`
- デフォルト: `<backend>/oauth/github/callback`
- 説明: Github OAuthのリダイレクトURIを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

### OpenID (OIDC)

#### `OAUTH_CLIENT_ID`

- タイプ: `str`
- 説明: OIDCのクライアントIDを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `OAUTH_CLIENT_SECRET`

- タイプ: `str`
- 説明: OIDCのクライアントシークレットを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `OPENID_PROVIDER_URL`

- タイプ: `str`
- 説明: `.well-known/openid-configuration`エンドポイントへのパス
- 永続性: この環境変数は`PersistentConfig`変数です

#### `OAUTH_PROVIDER_NAME`

- タイプ: `str`
- デフォルト: `SSO`
- 説明: OIDCプロバイダーの名前を設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `OPENID_REDIRECT_URI`

- タイプ: `str`
- デフォルト: `<backend>/oauth/oidc/callback`
- 説明: OIDCのリダイレクトURIを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

## LDAP

#### `ENABLE_LDAP`

- タイプ: `bool`
- デフォルト: `False`
- 説明: LDAP認証を有効または無効にします
- 永続性: この環境変数は`PersistentConfig`変数です

#### `LDAP_APP_DN`

- タイプ: `str`
- 説明: LDAPアプリケーションの識別名(DN)を設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `LDAP_APP_PASSWORD`

- タイプ: `str`
- 説明: LDAPアプリケーションのパスワードを設定します
- 永続性: この環境変数は`PersistentConfig`変数です

#### `LDAP_ATTRIBUTE_FOR_USERNAME`

- タイプ: `str`
- 説明: LDAP認証でユーザー名として使用する属性を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_ATTRIBUTE_FOR_MAIL`

- タイプ: `str`
- 説明: LDAP認証でメールとして使用する属性を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_CA_CERT_FILE`

- タイプ: `str`
- 説明: LDAP CA証明書ファイルのパスを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_CIPHERS`

- タイプ: `str`
- デフォルト: `ALL`
- 説明: LDAP接続で使用する暗号スイートを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_SEARCH_BASE`

- タイプ: `str`
- 説明: LDAP認証で検索するベースDNを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_SEARCH_FILTERS`

- タイプ: `str`
- 説明: LDAP検索で使用するフィルタを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_SERVER_HOST`

- タイプ: `str`
- デフォルト: `localhost`
- 説明: LDAPサーバーのホスト名を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_SERVER_LABEL`

- タイプ: `str`
- 説明: LDAPサーバーのラベルを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_SERVER_PORT`

- タイプ: `int`
- デフォルト: `389`
- 説明: LDAPサーバーのポート番号を設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `LDAP_USE_TLS`

- タイプ: `bool`
- デフォルト: `True`
- 説明: LDAP接続でTLSを使用するかどうかを設定します。
- 永続性: この環境変数は `PersistentConfig` 変数です。

## ワークスペース権限

#### `USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ユーザーがワークスペースのモデルにアクセスする権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ユーザーがワークスペースのナレッジにアクセスする権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ユーザーがワークスペースのプロンプトにアクセスする権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS`

- タイプ: `bool`
- デフォルト: `False`
- 説明: ユーザーがワークスペースのツールにアクセスする権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

## チャット権限

#### `USER_PERMISSIONS_CHAT_FILE_UPLOAD`

- タイプ: `bool`
- デフォルト: `True`
- 説明: ユーザーがチャットにファイルをアップロードする権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_CHAT_DELETE`

- タイプ: `bool`
- デフォルト: `True`
- 説明: ユーザーがチャットを削除する権限を有効/無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_CHAT_EDIT`

- タイプ: `bool`
- デフォルト: `True`
- 説明: チャットの編集権限を有効または無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

#### `USER_PERMISSIONS_CHAT_TEMPORARY`

- タイプ: `bool`
- デフォルト: `True`
- 説明: 一時的なチャットの作成権限を有効または無効にします。
- 永続性: この環境変数は `PersistentConfig` 変数です。

## その他の環境変数

これらの変数は Sage WebUI に固有のものではありませんが、特定のコンテキストで有用です。

### クラウドストレージ

#### `STORAGE_PROVIDER`

- タイプ: `str`
- オプション:
  - `s3` - S3 クライアントライブラリと[Amazon S3 ストレージ](#amazon-s3-storage)で言及されている関連環境変数を使用
  - `gcs` - GCS クライアントライブラリと[Google Cloud Storage](#google-cloud-storage)で言及されている関連環境変数を使用

- デフォルト: 空文字列 (' ')、デフォルトは `local`
- 説明: ストレージプロバイダーを設定します。

#### Amazon S3 ストレージ

#### `S3_ACCESS_KEY_ID`

- タイプ: `str`
- 説明: S3 ストレージのアクセスキー ID を設定します。

#### `S3_BUCKET_NAME`

- タイプ: `str`
- 説明: S3 ストレージのバケット名を設定します。

#### `S3_ENDPOINT_URL`

- タイプ: `str`
- 説明: S3 ストレージのエンドポイント URL を設定します。

#### `S3_KEY_PREFIX`

- タイプ: `str`
- 説明: S3 オブジェクトのキープレフィックスを設定します。

#### `S3_REGION_NAME`

- タイプ: `str`
- 説明: S3 ストレージのリージョン名を設定します。

#### `S3_SECRET_ACCESS_KEY`

- タイプ: `str`
- 説明: S3 ストレージのシークレットアクセスキーを設定します。

#### Google Cloud Storage

#### `GOOGLE_APPLICATION_CREDENTIALS_JSON`

- タイプ: `str`
- 説明: Google アプリケーション認証情報 JSON ファイルの内容。
  - オプション - 提供されない場合、認証情報は環境から取得されます。ローカルで実行する場合はユーザー認証情報、Google Compute Engine で実行する場合は Google メタデータサーバーから取得されます。
  - サービスアカウント用のファイルはこの[ガイド](https://developers.google.com/workspace/guides/create-credentials#service-account)に従って生成できます。

#### `GCS_BUCKET_NAME`

- タイプ: `str`
- 説明: Google Cloud Storage のバケット名を設定します。バケットは既に存在している必要があります。

### データベースプール

#### `DATABASE_URL`

- タイプ: `str`
- デフォルト: `sqlite:///${DATA_DIR}/webui.db`
- 説明: 接続するデータベースの URL を指定します。

:::info

SQLite と Postgres をサポートしています。URL を変更してもデータベース間のデータ移行は行われません。
URL スキームに関するドキュメントは[こちら](https://docs.sqlalchemy.org/en/20/core/engines.html#database-urls)で確認できます。

:::

#### `DATABASE_POOL_SIZE`

- タイプ: `int`
- デフォルト: `0`
- 説明: データベースプールのサイズを指定します。`0` を指定するとプーリングが無効になります。

#### `DATABASE_POOL_MAX_OVERFLOW`

- タイプ: `int`
- デフォルト: `0`
- 説明: データベースプールの最大オーバーフローを指定します。

:::info

この設定に関する詳細は[こちら](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.max_overflow)で確認できます。

:::

#### `DATABASE_POOL_TIMEOUT`

- タイプ: `int`
- デフォルト: `30`
- 説明: データベースプールから接続を取得する際のタイムアウト時間（秒単位）を指定します。

:::info

この設定に関する詳細は[こちら](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.timeout)で確認できます。

:::

#### `DATABASE_POOL_RECYCLE`

- タイプ: `int`
- デフォルト: `3600`
- 説明: データベースプールの再接続間隔（秒単位）を指定します。

:::info

この設定に関する詳細は[こちら](https://docs.sqlalchemy.org/en/20/core/pooling.html#setting-pool-recycle)で確認できます。

:::

### Redis

#### `ENABLE_WEBSOCKET_SUPPORT`

- タイプ: `bool`
- デフォルト: `False`
- 説明: Sage WebUIでWebSocketサポートを有効にします（Redisと併用）。

#### `WEBSOCKET_MANAGER`

- タイプ: `str`
- デフォルト: `redis`
- 説明: 使用するWebSocketマネージャーを指定します（この場合はRedis）。

#### `WEBSOCKET_REDIS_URL` （将来的なユースケースのために`REDIS_URL`も存在します。実際には両方を設定することを推奨します。）

- タイプ: `str`
- デフォルト: `redis://localhost:6379/0`
- 説明: WebSocket通信用のRedisインスタンスのURLを指定します。

### プロキシ設定

Sage WebUIはHTTPおよびHTTPS取得用のプロキシ使用をサポートしています。プロキシ設定を指定するため、
Sage WebUIは以下の環境変数を使用します：

#### `http_proxy`

- タイプ: `str`
- 説明: HTTPプロキシのURLを設定します。

#### `https_proxy`

- タイプ: `str`
- 説明: HTTPSプロキシのURLを設定します。

#### `no_proxy`

- タイプ: `str`
- 説明: プロキシを使用しないドメイン拡張子（またはIPアドレス）をカンマ区切りでリストします。
例えば、no_proxyを'.mit.edu'に設定すると、MITのドキュメントにアクセスする際にプロキシがバイパスされます。