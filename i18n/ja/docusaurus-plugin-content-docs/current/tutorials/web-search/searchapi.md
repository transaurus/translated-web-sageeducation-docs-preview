---
sidebar_position: 9
title: "SearchApi"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケースに合わせてSage Open WebUIをカスタマイズする方法のデモンストレーションとしてのみ提供されています。寄稿をご希望ですか？寄稿ガイドをチェックしてください。
:::

## SearchApi API

[SearchApi](https://searchapi.io)は、リアルタイムのSERP APIのコレクションです。`organic_results`を返す既存または今後のSERPエンジンがすべてサポートされています。デフォルトのウェブ検索エンジンは`google`ですが、`bing`、`baidu`、`google_news`、`bing_news`、`google_scholar`、`google_patents`などに変更できます。

### セットアップ

1. [SearchApi](https://searchapi.io)にアクセスし、ログインまたは新規アカウントを作成します。
2. `ダッシュボード`に移動し、APIキーをコピーします。
3. `APIキー`を取得したら、`Sage Open WebUI管理パネル`を開き、`設定`タブをクリックしてから`ウェブ検索`をクリックします。
4. `ウェブ検索`を有効にし、`ウェブ検索エンジン`を`searchapi`に設定します。
5. `SearchApi APIキー`に、[SearchApi](https://www.searchapi.io/)ダッシュボードからステップ2でコピーした`APIキー`を入力します。
6. [オプション] クエリを実行したい`SearchApiエンジン`名を入力します。例: `google`、`bing`、`baidu`、`google_news`、`bing_news`、`google_videos`、`google_scholar`、`google_patents`。デフォルトは`google`に設定されています。
7. `保存`をクリックします。

![Sage Open WebUI管理パネル](/images/tutorial_searchapi_search.png)

#### 注意

[SearchApi](https://www.searchapi.io/)エンジンを使用してウェブ検索を行うには、プロンプトフィールドで`ウェブ検索`を有効にする必要があります。プラス（`+`）ボタンを使用して有効にしてください。

![ウェブ検索を有効にする](/images/enable_web_search.png)