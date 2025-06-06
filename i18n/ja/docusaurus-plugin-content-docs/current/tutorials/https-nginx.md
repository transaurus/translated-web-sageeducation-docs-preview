---
sidebar_position: 200
title: "🔒 HTTPS using Nginx"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによるサポート対象外です。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとしてご利用ください。寄稿をご希望ですか？ 寄稿ガイドをご確認ください。
:::

# Nginxを使用したHTTPS設定

ユーザーとSage WebUI間の通信を安全に保つことは極めて重要です。HTTPS（HyperText Transfer Protocol Secure）は送信データを暗号化し、盗聴や改ざんから保護します。Nginxをリバースプロキシとして設定することで、Sage WebUIのデプロイメントにシームレスにHTTPSを追加でき、セキュリティと信頼性を向上させられます。

本ガイドではHTTPSを設定する2つの方法を提供します：

- **自己署名証明書**: 開発環境や内部利用に最適
- **Let's Encrypt**: 信頼されたSSL証明書が必要な本番環境に最適

デプロイメント要件に最も適した方法を選択してください。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import SelfSigned from './tab-nginx/SelfSigned.md';
import LetsEncrypt from './tab-nginx/LetsEncrypt.md';

<Tabs>
  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
</Tabs>

## 次のステップ

HTTPS設定後、以下のURLでSage WebUIに安全にアクセスできます：

- [https://localhost](https://localhost)

ドメイン名を使用する場合はDNSレコードが正しく設定されていることを確認してください。本番環境では、信頼されたSSL証明書のためにLet's Encryptの使用を推奨します。

---