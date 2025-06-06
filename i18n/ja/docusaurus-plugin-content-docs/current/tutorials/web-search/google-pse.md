---
sidebar_position: 5
title: "Google PSE"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケースに合わせてSage Open WebUIをカスタマイズする方法のデモンストレーションとしてのみ提供されています。寄稿をご希望ですか？寄稿チュートリアルをご確認ください。
:::

## Google PSE API

### セットアップ

1. Google Developersにアクセスし、[Programmable Search Engine](https://developers.google.com/custom-search)を使用して、ログインまたはアカウントを作成します。
2. [コントロールパネル](https://programmablesearchengine.google.com/controlpanel/all)に移動し、`追加`ボタンをクリックします。
3. 検索エンジン名を入力し、必要に応じて他のプロパティを設定し、ロボットでないことを確認して`作成`ボタンをクリックします。
4. `APIキー`を生成し、`検索エンジンID`を取得します（エンジン作成後に利用可能）。
5. `APIキー`と`検索エンジンID`を取得したら、`Sage Open WebUI管理パネル`を開き、`設定`タブをクリックしてから`ウェブ検索`をクリックします。
6. `ウェブ検索`を有効にし、`ウェブ検索エンジン`を`google_pse`に設定します。
7. `Google PSE APIキー`に`APIキー`を、`Google PSEエンジンID`に（手順4で取得した）IDを入力します。
8. `保存`をクリックします。

![Sage Open WebUI管理パネル](/images/tutorial_google_pse1.png)

#### 注意

プロンプトフィールドで`ウェブ検索`を有効にする必要があります。プラス（`+`）ボタンを使用してください。
ウェブを検索しましょう ;-)

![ウェブ検索を有効にする](/images/tutorial_google_pse2.png)