---
sidebar_position: 14
title: "🛃 Setting up with Custom CA Store"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿したい場合は、寄稿チュートリアルを確認してください。
:::

OIを実行しようとした際に`[SSL: CERTIFICATE_VERIFY_FAILED]`エラーが発生した場合、ほとんどの場合、HTTPSトラフィックをインターセプトするネットワーク（例：企業ネットワーク）に接続していることが原因です。

この問題を解決するには、新しい証明書をOIのトラストストアに追加する必要があります。

**事前にビルドされたDockerイメージの場合**:

1. ホストマシンの証明書ストアをコンテナにマウントします。`docker run`にコマンドラインオプション`--volume=/etc/ssl/certs/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro`を渡します。
2. Pythonにシステムのトラストストアを使用させるため、`REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt`を設定します（詳細はhttps://docs.docker.com/reference/cli/docker/container/run/#envを参照）。

環境変数`REQUESTS_CA_BUNDLE`が機能しない場合は、[httpxドキュメント](https://www.python-httpx.org/environment_variables/#ssl_cert_file)に従って、同じ値で`SSL_CERT_FILE`を設定してみてください。

[@KizzyCode](https://github.com/Startr/AI-WEB-openwebui/issues/1398#issuecomment-2258463210)による`compose.yaml`の例:

```yaml
services:
  openwebui:
    image: ghcr.io/Startr/AI-WEB-openwebui:main
    volumes:
      - /var/containers/openwebui:/app/backend/data:rw
      - /etc/containers/openwebui/compusrv.crt:/etc/ssl/certs/ca-certificates.crt:ro
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - WEBUI_NAME=compusrv
      - ENABLE_SIGNUP=False
      - ENABLE_COMMUNITY_SHARING=False
      - WEBUI_SESSION_COOKIE_SAME_SITE=strict
      - WEBUI_SESSION_COOKIE_SECURE=True
      - ENABLE_OLLAMA_API=False
      - REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

`ro`フラグはCAストアを読み取り専用でマウントし、ホストのCAストアへの誤った変更を防ぎます。
**ローカル開発の場合**:

`Dockerfile`を変更してビルドプロセス中に証明書を追加することもできます。これは、UIに変更を加えたい場合などに便利です。
ビルドは[マルチステージ](https://docs.docker.com/build/building/multi-stage/)で行われるため、証明書を両方のステージに追加する必要があります。

1. フロントエンド（`build`ステージ）:

```dockerfile
COPY package.json package-lock.json <YourRootCert>.crt ./
ENV NODE_EXTRA_CA_CERTS=/app/<YourRootCert>.crt
RUN npm ci
```

2. バックエンド（`base`ステージ）:

```dockerfile
COPY <CorporateSSL.crt> /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV PIP_CERT=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```