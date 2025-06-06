---
sidebar_position: 4
title: "⚙️ Chat Parameters"
---

Sage WebUIでは、**システムプロンプト**と**詳細パラメータ**を設定する3つのレベルがあります：チャットごと、モデルごと、アカウントごとです。この階層構造により、柔軟性を保ちつつ体系的な管理と制御が可能になります。

## システムプロンプトと詳細パラメータの階層図

| **Level** | **Definition** | **Modification Permissions** | **Override Capabilities** |
| --- | --- | --- | --- |
| **Per-Chat** | System prompt and advanced parameters for a specific chat instance | Users can modify, but cannot override model-specific settings | Restricted from overriding model-specific settings |
| **Per-Account** | Default system prompt and advanced parameters for a specific user account | Users can set, but may be overridden by model-specific settings | User settings can be overridden by model-specific settings |
| **Per-Model** | Default system prompt and advanced parameters for a specific model | Administrators can set, Users cannot modify | Admin-specific settings take precedence, User settings can be overridden |

### 1. **チャットごと:**

- **説明**: チャットごとの設定は、特定のチャットインスタンスに対して設定されたシステムプロンプトと詳細パラメータを指します。これらの設定は現在の会話にのみ適用され、今後のチャットには影響しません。
- **設定方法**: ユーザーはSage WebUIの右サイドバーにある**チャットコントロール**セクションで、特定のチャットインスタンスのシステムプロンプトと詳細パラメータを変更できます。
- **上書き能力**: ユーザーは、管理者がモデルごとに設定した**システムプロンプト**や特定の**詳細パラメータ**（**#2**）を上書きすることはできません。これにより、一貫性が保たれ、モデル固有の設定が遵守されます。

<details>
<summary>Example Use Case</summary>
:::tip[**Per-chat basis**:]
Suppose a user wants to set a custom system prompt for a specific conversation. They can do so by accessing the **Chat Controls** section and modifying the **System Prompt** field. These changes will only apply to the current chat session.
:::
</details>

### 2. **アカウントごと:**

- **説明**: アカウントごとの設定は、特定のユーザーアカウントに対して設定されたデフォルトのシステムプロンプトと詳細パラメータを指します。ユーザー固有の変更は、下位レベルの設定が定義されていない状況でのフォールバックとして機能します。
- **設定方法**: ユーザーは、Sage Open WebUIの**設定**メニューの**一般**セクションで、自分のアカウントのシステムプロンプトと詳細パラメータを設定できます。
- **上書き能力**: ユーザーは自分のアカウントでシステムプロンプトを設定できますが、管理者が使用中の特定のモデルに対してモデルごとに**システムプロンプト**や特定の**詳細パラメータ**を設定している場合、それらのパラメータは上書きされる可能性があることに注意する必要があります。

<details>
<summary>Example Use Case</summary>
:::tip[**Per-account basis**:]
Suppose a user wants to set their own system prompt for their account. They can do so by accessing the **Settings** menu and modifying the **System Prompt** field.
:::
</details>

### 3. **モデルごと:**

- **説明**: モデルごとの設定は、特定のモデルに対して設定されたデフォルトのシステムプロンプトと詳細パラメータを指します。これらの設定は、そのモデルを使用するすべてのチャットインスタンスに適用されます。
- **設定方法**: 管理者は、Sage WebUIの**ワークスペース**セクションの**モデル**セクションで、特定のモデルのデフォルトシステムプロンプトと詳細パラメータを設定できます。
- **上書き能力**: **ユーザー**アカウントは、モデルごとに設定された**システムプロンプト**や特定の**詳細パラメータ**（**#3**）を変更することはできません。この制限により、ユーザーがデフォルト設定を不適切に変更するのを防ぎます。
- **コンテキスト長の保持:** 管理者が**ワークスペース**セクションでモデルの**システムプロンプト**や特定の**詳細パラメータ**を手動で設定した場合、その**システムプロンプト**や手動で設定された**詳細パラメータ**は、**ユーザー**アカウントが**一般**設定や**チャットコントロール**セクションでアカウントごとに上書きまたは調整することはできません。これにより、一貫性が保たれ、ユーザーのコンテキスト長設定が変更されるたびにモデルが過剰に再読み込みされるのを防ぎます。
- **モデルの優先順位:** 管理者が**ワークスペース**セクションでモデルの**システムプロンプト**や特定の**詳細パラメータ**の値を事前に設定している場合、**ユーザー**アカウントが**一般**設定や**チャットコントロール**セクションで行ったコンテキスト長の変更は無視され、そのモデルの事前設定された値が維持されます。管理者が変更していないパラメータは、ユーザーアカウントがアカウントごとまたはチャットごとに手動で調整できることに注意してください。

<details>
<summary>Example Use Case</summary>
:::tip[**Per-model basis**:]
Suppose an administrator wants to set a default system prompt for a specific model. They can do so by accessing the **Models** section and modifying the **System Prompt** field for the corresponding model. Any chat instances using this model will automatically use the model's system prompt and advanced parameters.
:::
</details>

## **最大の柔軟性を得るためのシステムプロンプト設定の最適化**

:::tip[**ボーナスティップ**]
**このヒントは管理者アカウントとユーザーアカウントの両方に適用されます。システムプロンプトを最大限に柔軟に活用するためには、以下の設定を検討することをお勧めします:**

- 主要なシステムプロンプト（**例：LLMに定義的なキャラクターを与える**）は、**一般**設定の**システムプロンプト**フィールドに割り当てます。これにより、アカウントレベルで設定され、**ワークスペース**セクション内のモデルごとの調整を必要とせず、すべてのLLMでシステムプロンプトとして機能します。

- 二次的なシステムプロンプト（**例：LLMに実行させるタスクを与える**）については、**チャットコントロール**サイドバー内の**システムプロンプト**フィールド（チャットごと）または管理者向けの**ワークスペース**セクションの**モデル**セクション内の**システムプロンプト**フィールド（モデルごと）のいずれかに配置するかを選択します。これにより、アカウントレベルのシステムプロンプトが、**チャットコントロール**によって提供されるチャットごとのシステムプロンプト、または**モデル**によって提供されるモデルごとのシステムプロンプトと連携して機能します。

- 管理者として、最適な柔軟性を得るためには、**モデル**セクションを使用してLLMパラメータをモデルごとに割り当てるべきです。これらの二次的なシステムプロンプトについては、異なるアカウントごとやチャットごとのインスタンス間で必要な調整を最小限に抑え、柔軟性を最大化する方法で設定してください。管理者アカウントおよびすべてのユーザーアカウントが、**チャットコントロール**と**モデル**セクション内のシステムプロンプトが**LLM**に適用される優先順位を理解することが重要です。
:::