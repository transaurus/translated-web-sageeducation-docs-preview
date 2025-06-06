---
sidebar_position: 1
title: "Bing"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケースに合わせてSage Open WebUIをカスタマイズする方法のデモンストレーションとしてのみ提供されています。寄稿をご希望ですか？寄稿ガイドをご確認ください。
:::

## Bing API

### セットアップ

1. [Azureポータル](https://portal.azure.com/#create/Microsoft.BingSearch)にアクセスし、新しいリソースを作成します。作成後、リソース概要ページにリダイレクトされます。そこで「キーを管理するにはここをクリック」を選択してください。![キー管理画面へのリンク](https://github.com/user-attachments/assets/dd2a3c67-d6a7-4198-ba54-67a3c8acff6d)
2. キー管理ページで、Key1またはKey2を探し、使用したいキーをコピーします。
3. Sage Open WebUIの管理パネルを開き、設定タブに切り替えて「Web検索」を選択します。
4. Web検索オプションを有効にし、Web検索エンジンを「bing」に設定します。
5. `SearchApi API Key`に、手順2で[Azureポータル](https://portal.azure.com/#create/Microsoft.BingSearch)ダッシュボードからコピーした`APIキー`を入力します。
6. 「保存」をクリックします。