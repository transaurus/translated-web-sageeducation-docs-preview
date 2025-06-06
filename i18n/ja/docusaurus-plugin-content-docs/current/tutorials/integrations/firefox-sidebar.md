---
sidebar_position: 4100
title: "🦊 Firefox AI Chatbot Sidebar"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによるサポートはありません。特定のユースケース向けにSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したいですか？コントリビューションガイドをチェックしてください。
:::

## 🦊 Firefox AIチャットボットサイドバー

# Mozilla FirefoxでローカルAIチャットボットブラウザアシスタントとしてSage WebUIを統合する

目次
=================

1. [前提条件](#前提条件)
2. [FirefoxでAIチャットボットを有効化](#firefoxでaiチャットボットを有効化)
3. [about:config設定の構成](#aboutconfig設定の構成)
    * [browser.ml.chat.enabled](#browsermlchatenabled)
    * [browser.ml.chat.hideLocalhost](#browsermlchathidelocalhost)
    * [browser.ml.chat.prompts.#](#browsermlchatsprompts)
    * [browser.ml.chat.provider](#browsermlchatprovider)
4. [Sage WebUI向けURLパラメータ](#sage-open-webui向けurlパラメータ)
    * [モデルとモデル選択](#モデルとモデル選択)
    * [YouTube文字起こし](#youtube文字起こし)
    * [ウェブ検索](#ウェブ検索)
    * [ツール選択](#ツール選択)
    * [通話オーバーレイ](#通話オーバーレイ)
    * [初期クエリプロンプト](#初期クエリプロンプト)
    * [一時的なチャットセッション](#一時的なチャットセッション)
5. [追加のabout:config設定](#追加のaboutconfig設定)
6. [AIチャットボットサイドバーへのアクセス](#aiチャットボットサイドバーへのアクセス)

## 前提条件

Mozilla FirefoxでAIチャットボットブラウザアシスタントとしてSage WebUIを統合する前に、以下を確認してください：

* Sage WebUIインスタンスのURL（ローカルまたはドメイン）
* Firefoxブラウザがインストールされていること

## FirefoxでAIチャットボットを有効化

1. ハンバーガーボタン（右上隅の「X」ボタンのすぐ下にある三本線のボタン）をクリック
2. Firefox設定を開く
3. `Firefox Labs`セクションをクリック
4. `AI Chatbot`をトグルオン

または、`about:config`ページからAIチャットボットを有効化することもできます（次のセクションで説明）。

## about:config設定の構成

1. Firefoxのアドレスバーに`about:config`と入力
2. `リスクを承諾して続行`をクリック
3. `browser.ml.chat.enabled`を検索し、Firefox Labs経由で有効になっていない場合は`true`にトグル
4. `browser.ml.chat.hideLocalhost`を検索し、`false`にトグル

### browser.ml.chat.prompts.#

カスタムプロンプトを追加するには、以下の手順に従ってください：

1. `browser.ml.chat.prompts.#`を検索（`#`を数字に置き換え、例：`0`、`1`、`2`など）
2. `+`ボタンをクリックして新しいプロンプトを追加
3. プロンプトのラベル、値、IDを入力（例：`{"id":"My Prompt", "value": "This is my custom prompt.", "label": "My Prompt"}`）
4. 必要に応じてこのプロセスを繰り返してさらにプロンプトを追加

### browser.ml.chat.provider

1. `browser.ml.chat.provider`を検索
2. Sage WebUIインスタンスのURLを入力（オプションパラメータを含む、例：`https://my-sage-open-webui-instance.com/?model=browser-productivity-assistant&temporary-chat=true&tools=jina_web_scrape`）

## Sage WebUI向けURLパラメータ

以下のURLパラメータを使用してSage WebUIインスタンスをカスタマイズできます：

### モデルとモデル選択

* `models`: チャットセッション用に複数のモデルを指定（カンマ区切りリスト、例：`/?models=model1,model2`）
* `model`: チャットセッション用に単一のモデルを指定（例：`/?model=model1`）

### YouTube動画の文字起こし

* `youtube`: YouTube動画のIDを指定して、チャット内で動画の文字起こしを行う（例: `/?youtube=動画ID`）

### Web検索

* `web-search`: Web検索機能を有効にするには、このパラメータを`true`に設定（例: `/?web-search=true`）

### ツール選択

* `tools` または `tool-ids`: チャットで有効にするツールIDをカンマ区切りで指定（例: `/?tools=ツール1,ツール2` または `/?tool-ids=ツール1,ツール2`）

### 通話オーバーレイ

* `call`: チャットインターフェースにビデオ/通話オーバーレイを表示するには、このパラメータを`true`に設定（例: `/?call=true`）

### 初期クエリプロンプト

* `q`: チャットの初期クエリ/プロンプトを設定（例: `/?q=こんにちは`）

### 一時的なチャットセッション

* `temporary-chat`: チャットを一時セッションとしてマークするには、このパラメータを`true`に設定（例: `/?temporary-chat=true`）

URLパラメータの詳細な使用方法については、/features/chat-features/url-params を参照してください。

## 追加のabout:config設定

以下の`about:config`設定を調整することで、さらにカスタマイズ可能です:

* `browser.ml.chat.shortcuts`: AIチャットボットサイドバーのカスタムショートカットを有効化
* `browser.ml.chat.shortcuts.custom`: AIチャットボットサイドバーのカスタムショートカットキーを有効化
* `browser.ml.chat.shortcuts.longPress`: ショートカットキーの長押し遅延時間を設定
* `browser.ml.chat.sidebar`: AIチャットボットサイドバーを有効化
* `browser.ml.checkForMemory`: モデル読み込み前に利用可能メモリをチェック
* `browser.ml.defaultModelMemoryUsage`: モデルのデフォルトメモリ使用量を設定
* `browser.ml.enable`: Firefoxの機械学習機能を有効化
* `browser.ml.logLevel`: 機械学習機能のログレベルを設定
* `browser.ml.maximumMemoryPressure`: 最大メモリプレッシャー閾値を設定
* `browser.ml.minimumPhysicalMemory`: 必要最小物理メモリを設定
* `browser.ml.modelCacheMaxSize`: モデルキャッシュの最大サイズを設定
* `browser.ml.modelCacheTimeout`: モデルキャッシュのタイムアウトを設定
* `browser.ml.modelHubRootUrl`: モデルハブのルートURLを設定
* `browser.ml.modelHubUrlTemplate`: モデルハブのURLテンプレートを設定
* `browser.ml.queueWaitInterval`: キュー待機間隔を設定
* `browser.ml.queueWaitTimeout`: キュー待機タイムアウトを設定

## AIチャットボットサイドバーの起動方法

AIチャットボットサイドバーを起動するには、以下のいずれかの方法を使用します:

* `CTRL+B`を押してブックマークサイドバーを開き、AIチャットボットに切り替え
* `CTRL+Alt+X`を押して直接AIチャットボットサイドバーを開く