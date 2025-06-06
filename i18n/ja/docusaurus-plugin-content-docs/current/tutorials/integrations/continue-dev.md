---
sidebar_position: 13
title: "⚛️ Continue.dev VSCode Extension with Sage WebUI"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したいですか？コントリビューションのチュートリアルをチェックしてください。
:::

# Continue.dev VSCode拡張機能とSage WebUIの統合

### 拡張機能のダウンロード

VSCode拡張機能は[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue)からダウンロードできます。

インストール後、サイドバーに「continue」タブが表示されます。

これを開いてください。右下に設定アイコン（歯車のようなアイコン）が表示されます。

設定アイコンをクリックすると、エディタで`config.json`が開きます。

ここで、ContinueをSage WebUIと連携するように設定できます。

---

現在、「ollama」プロバイダは認証をサポートしていないため、Sage WebUIと一緒に使用することはできません。

ただし、OllamaとSage WebUIはどちらもOpenAI API仕様との互換性があります。Ollamaのブログ記事は[こちら](https://ollama.com/blog/openai-compatibility)で確認できます。

Continueをopenaiプロバイダとして設定することで、Sage WebUIの認証トークンを使用することが可能です。

---

## 設定

`config.json`では、以下のオプションを追加または変更する必要があります。

### プロバイダをopenaiに変更

```json
"provider": "openai"
```

### apiBaseを追加または更新

これをOpen Web UIのドメインに設定してください。

```json
"apiBase": "http://localhost:3000/" #If you followed Getting Started Docker
```

### apiKeyを追加

```json
"apiKey": "sk-79970662256d425eb274fc4563d4525b" # Replace with your API key
```

APIキーは、Sage WebUI -> 設定 -> アカウント -> APIキーから確認および生成できます。

「APIキー」（sk-で始まるもの）をコピーしてください。

## 設定例

以下は、openaiプロバイダ経由でSage WebUIを使用する`config.json`の基本例です。モデルとしてGranite Codeを使用しています。
使用する前に、モデルをollamaインスタンスにプルしておいてください。

```json
{
  "models": [
    {
      "title": "Granite Code",
      "provider": "openai",
      "model": "granite-code:latest",
      "useLegacyCompletionsEndpoint": false,
      "apiBase": "http://YOUROPENWEBUI/ollama/v1",
      "apiKey": "sk-YOUR-API-KEY"
    },
    {
      "title": "Model ABC from pipeline",
      "provider": "openai",
      "model": "PIPELINE_MODEL_ID",
      "useLegacyCompletionsEndpoint": false,
      "apiBase": "http://YOUROPENWEBUI/api",
      "apiKey": "sk-YOUR-API-KEY"
    }
  ],
  "customCommands": [
    {
      "name": "test",
      "prompt": "{{{ input }}}\n\nWrite a comprehensive set of unit tests for the selected code. It should setup, run tests that check for correctness including important edge cases, and teardown. Ensure that the tests are complete and sophisticated. Give the tests just as chat output, don't edit any file.",
      "description": "Write unit tests for highlighted code"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Granite Code",
    "provider": "openai",
    "model": "granite-code:latest",
    "useLegacyCompletionsEndpoint": false,
    "apiBase": "http://localhost:3000/ollama/v1",
    "apiKey": "sk-YOUR-API-KEY"
  }
}
```

`config.json`を保存すれば完了です！

Continueタブのモデル選択にモデルが表示されるはずです。

モデルを選択すると、Sage WebUI（または設定した[パイプライン](/pipelines)）経由でチャットできるようになります。

この方法は、使用したいモデルごとに適用できますが、コード用に設計されたモデルを使用することをお勧めします。

追加のContinue設定については、[Continueドキュメント](https://docs.continue.dev/reference/Model%20Providers/openai)を参照してください。