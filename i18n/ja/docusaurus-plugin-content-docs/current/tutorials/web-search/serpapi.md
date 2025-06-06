---
sidebar_position: 15
title: "SerpApi"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケース向けにSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをご確認ください。
:::

## SerpApi API

[SerpApi](https://serpapi.com/) は、高速で簡単かつ包括的なAPIを提供し、Googleやその他の検索エンジンからデータをスクレイピングします。`organic_results`を返す既存または今後のSERPエンジンであればすべてサポートされています。デフォルトのウェブ検索エンジンは`google`ですが、`bing`、`baidu`、`google_news`、`google_scholar`、`google_patents`などに変更可能です。

### セットアップ

1. [SerpApi](https://serpapi.com/)にアクセスし、ログインまたは新規アカウントを作成します。
2. `ダッシュボード`に移動し、APIキーをコピーします。
3. コピーした`APIキー`を使用して、`Sage Open WebUI管理パネル`を開き、`設定`タブをクリックしてから`ウェブ検索`を選択します。
4. `ウェブ検索`を有効にし、`ウェブ検索エンジン`を`serpapi`に設定します。
5. `SerpApi APIキー`に、手順2で[SerpApi](https://serpapi.com/)ダッシュボードからコピーした`APIキー`を入力します。
6. [オプション] クエリを実行したい`SerpApiエンジン`名を入力します。例: `google`、`bing`、`baidu`、`google_news`、`google_videos`、`google_scholar`、`google_patents`。デフォルトは`google`です。詳細は[SerpApiドキュメント](https://serpapi.com/dashboard)をご覧ください。
7. `保存`をクリックします。

![Sage Open WebUI管理パネル](/images/tutorial_serpapi_search.png)

#### 注意

[SerpApi](https://serpapi.com/)エンジンを使用してウェブ検索を行うには、プロンプトフィールドで`ウェブ検索`を有効にする必要があります。

![ウェブ検索を有効にする](/images/enable_web_search.png)