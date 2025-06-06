---
sidebar_position: 2
title: "🤝 Contributing Tutorials"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケース向けにSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿チュートリアルをご確認ください。
:::

# チュートリアル寄稿ガイド

Sage WebUIドキュメントへのチュートリアル寄稿にご興味をお持ちいただきありがとうございます。以下の手順に従って環境をセットアップし、チュートリアルを提出してください。

## 手順

1. **`openwebui/docs` GitHubリポジトリをフォークする**

   - GitHub上の[Sage WebUI Docsリポジトリ](https://github.com/Startr/docs)にアクセス
   - 右上隅の**Fork**ボタンをクリックして、GitHubアカウント下にコピーを作成

2. **GitHub Actionsを有効化**

   - フォークしたリポジトリで**Actions**タブに移動
   - プロンプトが表示された場合は、画面の指示に従ってGitHub Actionsを有効化

3. **GitHub Pagesを有効化**

   - フォークしたリポジトリで**Settings** > **Pages**に移動
   - **Source**でデプロイしたいブランチ（例：`main`）とフォルダ（例：`/docs`）を選択
   - **Save**をクリックしてGitHub Pagesを有効化

4. **GitHub環境変数を設定**

   - フォークしたリポジトリで**Settings** > **Secrets and variables** > **Actions** > **Variables**に移動
   - 以下の環境変数を追加：
     - `BASE_URL`を`/docs`（またはフォーク用に選択したベースURL）に設定
     - `SITE_URL`を`https://<your-github-username>.github.io/`に設定

### 📝 GitHub Pagesワークフローと設定ファイルの更新

カスタムセットアップに合わせてデプロイ設定を調整する必要がある場合の手順：

a. **`.github/workflows/gh-pages.yml`を更新**

- 必要に応じてビルドステップに`BASE_URL`と`SITE_URL`の環境変数を追加：

     ```yaml
       - name: Build
         env:
           BASE_URL: ${{ vars.BASE_URL }}
           SITE_URL: ${{ vars.SITE_URL }}
         run: npm run build
     ```

b. **`docusaurus.config.ts`を修正して環境変数を使用**

- `docusaurus.config.ts`を更新してこれらの環境変数を使用し、ローカルまたは直接デプロイ用のデフォルト値を設定：

     ```typescript
     const config: Config = {
       title: "Sage WebUI",
       tagline: "ChatGPT-Style WebUI for LLMs (Formerly Ollama WebUI)",
       favicon: "images/favicon.png",
       url: process.env.SITE_URL || "https://sage.education",
       baseUrl: process.env.BASE_URL || "/",
       ...
     };
     ```

- この設定により、フォークやカスタムセットアップでも一貫したデプロイ動作が保証されます

5. **`gh-pages` GitHubワークフローを実行**

   - **Actions**タブで`gh-pages`ワークフローを特定
   - 必要に応じて手動でワークフローをトリガー、または設定に基づいて自動実行される場合もあります

6. **フォークしたコピーを閲覧**

   - `https://<your-github-username>.github.io/<BASE_URL>`にアクセスしてフォークしたドキュメントを表示

7. **変更を草案**

   - フォークしたリポジトリで適切なディレクトリ（例：`docs/tutorial/`）に移動
   - チュートリアル用の新しいmarkdownファイルを作成、または既存のファイルを編集
   - チュートリアルに未サポート警告バナーを含めることを確認

8. **プルリクエストを提出**

   - チュートリアルが準備できたら、変更をフォークしたリポジトリにコミット
   - 元の`sage-open-webui/docs`リポジトリに移動
   - **New Pull Request**をクリックし、ソースとしてフォークとブランチを選択
   - 説明的なタイトルと説明をPRに記載
   - レビューのためにプルリクエストを提出

## 重要事項

コミュニティ寄稿のチュートリアルには以下を含める必要があります：

```
:::warning
This tutorial is a community contribution and is not supported by the Sage WebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::
```

---

:::tip[Docusaurusをローカルでテストする方法]
以下のコマンドでDocusaurusサイトをローカルでテストできます：

```bash
npm install   # 依存関係をインストール
npm run build # 本番用にサイトをビルド
```

これにより、デプロイ前に問題を発見できます
:::

---