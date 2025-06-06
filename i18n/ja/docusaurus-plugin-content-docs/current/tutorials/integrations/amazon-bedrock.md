---
sidebar_position: 31
title: "🛌 Integrate with Amazon Bedrock"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによってサポートされていません。特定のユースケース向けにSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？ 寄稿ガイドをご確認ください。
:::

---

# Sage Open WebUIとAmazon Bedrockの統合

このチュートリアルでは、sage-open-webuiとAmazon Bedrockを統合する最も一般的で人気のあるアプローチの1つを探ります。

## 前提条件

このチュートリアルを進めるには、以下が必要です：

- 有効なAWSアカウント
- 有効なAWSアクセスキーとシークレットキー
- AWSでBedrockモデルを有効化するIAM権限、または既に有効化されたモデル
- システムにインストールされたDocker

## Amazon Bedrockとは

AWSのウェブサイトより直接引用：

「Amazon Bedrockは、AI21 Labs、Anthropic、Cohere、Luma、Meta、Mistral AI、poolside（近日公開予定）、Stability AI、Amazonなどの主要AI企業の高性能基盤モデル（FM）を単一のAPIから選択できる完全マネージドサービスです。セキュリティ、プライバシー、責任あるAIを備えた生成AIアプリケーションを構築するために必要な幅広い機能を提供します。Amazon Bedrockを使用すると、ユースケースに最適なトップFMを簡単に試して評価し、ファインチューニングやRetrieval Augmented Generation（RAG）などの技術で独自のデータを使用して非公開にカスタマイズし、エンタープライズシステムとデータソースを使用してタスクを実行するエージェントを構築できます。Amazon Bedrockはサーバーレスであるため、インフラストラクチャを管理する必要がなく、既に慣れ親しんでいるAWSサービスを使用して生成AI機能をアプリケーションに安全に統合および展開できます。」

Bedrockの詳細については、[Amazon Bedrock公式ページ](https://aws.amazon.com/bedrock/)をご覧ください。

# 統合手順

## ステップ1: Amazon Bedrockベースモデルへのアクセスを確認

Bedrockと統合する前に、まず利用可能なベースモデルのうち少なくとも1つ（できれば複数）にアクセスできることを確認する必要があります。この記事の執筆時点（2025年2月）では、47のベースモデルが利用可能でした。以下のスクリーンショットでわかるように、私は複数のモデルにアクセスできます。モデル横に「✅ アクセス許可済み」と表示されていれば、そのモデルにアクセスできます。どのモデルにもアクセスできない場合、次のステップでエラーが発生します。

AWSは、これらのモデルのアクセス要求/有効化に関する優れたドキュメントを提供しています：[Amazon Bedrockモデルアクセスドキュメント](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html)

![Amazon Bedrockベースモデル](/images/tutorials/amazon-bedrock/amazon-bedrock-base-models.png)

## ステップ2: Bedrock Access Gatewayの設定

少なくとも1つのBedrockベースモデルにアクセスできるようになったので、Bedrock Access Gateway（BAG）を設定する必要があります。BAGは、AWSが開発したプロキシまたはミドルウェアと考えることができ、BedrockのAWSネイティブエンドポイント/SDKをラップし、sage-open-webuiが要求するOpenAIのスキーマと互換性のあるエンドポイントを公開します。

参考までに、エンドポイント間の簡単なマッピングを以下に示します：

| OpenAI Endpoint       | Bedrock Method         |
|-----------------------|------------------------|
| `/models`               | list_inference_profiles    |
| `/models/{model_id}`    | list_inference_profiles    |
| `/chat/completions`     | converse or converse_stream    |
| `/embeddings`           | invoke_model           |

BAGリポジトリはこちら：[Bedrock Access Gatewayリポジトリ](https://github.com/aws-samples/bedrock-access-gateway)

BAGを設定するには、以下の手順に従ってください：

- BAGリポジトリをクローン
- デフォルトの`dockerfile`を削除
- `Dockerfile_ecs`の名前を`Dockerfile`に変更

これで、以下のコマンドを使用してDockerコンテナをビルドおよび起動する準備が整いました：

```bash
docker build . -f Dockerfile -t bedrock-gateway

docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" -e AWS_REGION=us-east-1 -d -p 8000:80 bedrock-gateway
```

これでBAGのSwaggerページにアクセスできるようになります: http://localhost:8000/docs

![Bedrock Access Gateway Swagger](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-api.png)

## ステップ3: sage-open-webuiに接続を追加

BAGが起動・実行されているので、次はsage-open-webuiに新しい接続として追加します。

- 管理者パネルで、設定 -> 接続 に移動します
- "+"（プラス）ボタンを使用してOpenAIの下に新しい接続を追加します
- URLには「http://host.docker.internal:8000/api/v1」を使用します
- パスワードには、BAGで定義されているデフォルトの「bedrock」を使用します（DEFAULT_API_KEYSでこのパスワードは変更可能です）
- 「接続を確認」ボタンをクリックすると、右上に「サーバー接続が確認されました」というアラートが表示されます

![Add New Connection](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-connection.png)

## ステップ4: Bedrockベースモデルの使用を開始

これで、すべてのBedrockモデルが利用可能になっているはずです！

![Use Bedrock Models](/images/tutorials/amazon-bedrock/amazon-bedrock-models-in-oui.png)

## その他の役立つチュートリアル

sage-open-webuiをAmazon Bedrockと統合する際に役立つ他のチュートリアルをいくつか紹介します。

- https://gauravve.medium.com/connecting-sage-open-webui-to-aws-bedrock-a1f0082c8cb2
- https://jrpospos.blog/posts/2024/08/using-amazon-bedrock-with-openwebui-when-working-with-sensitive-data/