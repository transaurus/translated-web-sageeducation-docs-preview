---
sidebar_position: 320
title: "🪣 Switching to S3 Storage"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによるサポート対象外です。特定のユースケース向けにSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？ 寄稿ガイドをご確認ください。
:::

# 🪣 S3ストレージへの切り替え

このガイドでは、Sage Open WebUIのデフォルト設定である`local`ストレージからAmazon S3への切り替え手順を説明します。

## 前提条件

このチュートリアルを進めるには、以下が必要です：

- 有効なAWSアカウント
- 有効なAWSアクセスキーとシークレットキー
- AWSでS3バケットの作成とオブジェクト配置が可能なIAM権限
- システムにインストールされたDocker

## Amazon S3とは

AWS公式サイトより：

「Amazon S3は、業界をリードする拡張性、データ可用性、セキュリティ、パフォーマンスを提供するオブジェクトストレージサービスです。データレイク、ウェブサイト、クラウドネイティブアプリケーション、バックアップ、アーカイブ、機械学習、分析など、あらゆる使用事例に対応し、あらゆる量のデータを保存・保護できます。Amazon S3は99.999999999%（イレブンナイン）の耐久性を設計しており、世界中の数百万の顧客のデータを保存しています。」

S3の詳細はこちら：[Amazon S3公式ページ](https://aws.amazon.com/s3/)

# セットアップ方法

## 1. 必要な環境変数

このオプションを設定するには、以下の環境変数を収集する必要があります：

| **sage-open-webui Environment Variable** | **Example Value**                           |
|-------------------------------------|---------------------------------------------|
| `S3_ACCESS_KEY_ID`                  | ABC123                                      |
| `S3_SECRET_ACCESS_KEY`              | SuperSecret                                 |
| `S3_ENDPOINT_URL`                   | https://s3.us-east-1.amazonaws.com          |
| `S3_REGION_NAME`                    | us-east-1                                   |
| `S3_BUCKET_NAME`                    | my-awesome-bucket-name                      |

- S3_ACCESS_KEY_ID: AWSアカウントのアクセスキー識別子。AWS管理コンソールまたはAWS CLIでアクセスキー作成時に取得します。
- S3_SECRET_ACCESS_KEY: AWSアクセスキーペアの秘密鍵部分。AWSでアクセスキー作成時に提供され、安全に保管する必要があります。
- S3_ENDPOINT_URL: S3サービスエンドポイントへのURL。通常はAWSサービスドキュメントまたはアカウント設定で確認できます。
- S3_REGION_NAME: S3バケットが存在するAWSリージョン（例："us-east-1"）。AWS管理コンソールのS3バケット詳細から確認可能です。
- S3_BUCKET_NAME: AWSでバケット作成時に指定した、S3バケットの一意の名前。

利用可能なS3エンドポイントURLの完全なリストはこちら：[Amazon S3通常エンドポイント](https://docs.aws.amazon.com/general/latest/gr/s3.html)

すべての`クラウドストレージ`設定オプションはこちら：[sage-open-webuiクラウドストレージ設定](https://docs.openwebui.com/getting-started/env-configuration#cloud-storage)

## 2. sage-open-webuiの起動

sage-open-webuiインスタンスを起動する前に、最後の環境変数`STORAGE_PROVIDER`を設定する必要があります。この変数はsage-open-webuiに使用するプロバイダーを伝えます。デフォルトでは`STORAGE_PROVIDER`は空で、sage-open-webuiはローカルストレージを使用します。

| **Storage Provider** | **Type** | **Description**                                                                                 | **Default** |
|----------------------|----------|-------------------------------------------------------------------------------------------------|-------------|
| `local`              | str      | Defaults to local storage if an empty string (`' '`) is provided                                | Yes         |
| `s3`                 | str      | Uses S3 client library and related environment variables mentioned in Amazon S3 Storage         | No          |
| `gcs`                | str      | Uses GCS client library and related environment variables mentioned in Google Cloud Storage     | No          |

Amazon S3を使用するには、`STORAGE_PROVIDER`を"S3"に設定し、ステップ1で収集したすべての環境変数（`S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY`、`S3_ENDPOINT_URL`、`S3_REGION_NAME`、`S3_BUCKET_NAME`）を設定します。

ここでは`ENV`を"dev"に設定しています。これによりsage-open-webuiのSwaggerドキュメントを確認でき、S3ストレージのセットアップが期待通りに動作していることをさらにテスト・確認できます。

```sh
docker run -d \
  -p 3000:8080 \
  -v sage-open-webui:/app/backend/data \
  -e STORAGE_PROVIDER="s3" \
  -e S3_ACCESS_KEY_ID="ABC123" \
  -e S3_SECRET_ACCESS_KEY="SuperSecret" \
  -e S3_ENDPOINT_URL="https://s3.us-east-1.amazonaws.com" \
  -e S3_REGION_NAME="us-east-1" \
  -e S3_BUCKET_NAME="my-awesome-bucket-name" \
  -e ENV="dev" \
  --name sage-open-webui \
  ghcr.io/sage-open-webui/sage-open-webui:main
```

## 3. セットアップのテスト

sage-open-webuiが起動したので、シンプルな`Hello, World`テキストファイルをアップロードしてセットアップをテストしましょう。

![sage-open-webuiでのファイルアップロード](/images/tutorials/amazon-s3/amazon-s3-upload-file.png)

そして、選択したLLMから応答が返ってくることを確認します。

![sage-open-webuiでの応答取得](/images/tutorials/amazon-s3/amazon-s3-oui-response.png)

素晴らしい！sage-open-webuiではすべてが期待通りに動作しているようです。次に、テキストファイルが実際にアップロードされ、指定したS3バケットに保存されたことを確認しましょう。AWSマネジメントコンソールを使用すると、S3バケットにファイルが存在することがわかります。アップロードしたファイル名（`hello.txt`）に加えて、オブジェクト名には一意のIDが付加されています。これはsage-open-webuiがアップロードされたすべてのファイルを追跡する方法です。

![S3バケット内のオブジェクト確認](/images/tutorials/amazon-s3/amazon-s3-object-in-bucket.png)

sage-open-webuiのSwaggerドキュメントを使用して、`/api/v1/files/{id}`エンドポイントに一意のID（4405fabb-603e-4919-972b-2b39d6ad7f5b）を渡すことで、このファイルに関連するすべての情報を取得できます。

![IDによるファイルの検査](/images/tutorials/amazon-s3/amazon-s3-get-file-by-id.png)