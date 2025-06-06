---
sidebar_position: 19
title: "🔒 SSO: Federated Authentication Support"
---

# フェデレーテッド認証のサポート

Sage WebUIは以下のフェデレーテッド認証方式をサポートしています：

1. OAuth2
    1. Google
    1. Microsoft
    1. Github
    1. OIDC
1. 信頼済みヘッダー

## OAuth

OAuthに関するグローバル設定オプションは以下の通りです：

1. `ENABLE_OAUTH_SIGNUP` - `true`の場合、OAuthログイン時にアカウント作成を許可します。`ENABLE_SIGNUP`とは異なります。
1. `OAUTH_MERGE_ACCOUNTS_BY_EMAIL` - OAuthプロバイダーから提供されたメールアドレスに一致するアカウントへのログインを許可します。
    - すべてのOAuthプロバイダーがメールアドレスを検証するわけではないため、これはセキュリティ上不安定とみなされ、アカウントの乗っ取りを許す可能性があります。

### Google

Google OAuthクライアントを設定するには、**ウェブアプリケーション**向けのGoogle OAuthクライアント作成方法について[Googleのドキュメント](https://support.google.com/cloud/answer/6158849)を参照してください。
許可されたリダイレクトURIには`<sage-open-webui>/oauth/google/callback`を含める必要があります。

以下の環境変数が必須です：

1. `GOOGLE_CLIENT_ID` - Google OAuthクライアントID
1. `GOOGLE_CLIENT_SECRET` - Google OAuthクライアントシークレット

### Microsoft

Microsoft OAuthクライアントを設定するには、**ウェブアプリケーション**向けのMicrosoft OAuthクライアント作成方法について[Microsoftのドキュメント](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)を参照してください。
許可されたリダイレクトURIには`<sage-open-webui>/oauth/microsoft/callback`を含める必要があります。

Microsoft OAuthのサポートは現在、単一テナント（単一のEntra組織または個人用Microsoftアカウント）に限定されています。

以下の環境変数が必須です：

1. `MICROSOFT_CLIENT_ID` - Microsoft OAuthクライアントID
1. `MICROSOFT_CLIENT_SECRET` - Microsoft OAuthクライアントシークレット
1. `MICROSOFT_CLIENT_TENANT_ID` - MicrosoftテナントID - 個人アカウントの場合は`9188040d-6c67-4c5b-b112-36a304b66dad`を使用

### Github

Github OAuthクライアントを設定するには、**ウェブアプリケーション**向けのOAuth AppまたはGithub App作成方法について[Githubのドキュメント](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)を参照してください。
許可されたリダイレクトURIには`<sage-open-webui>/oauth/github/callback`を含める必要があります。

以下の環境変数が必須です：

1. `GITHUB_CLIENT_ID` - Github OAuth AppクライアントID
1. `GITHUB_CLIENT_SECRET` - Github OAuth Appクライアントシークレット

### OIDC

OIDCをサポートする任意の認証プロバイダーを設定できます。
`email`クレームが必須です。
`name`および`picture`クレームが利用可能な場合は使用されます。
許可されたリダイレクトURIには`<sage-open-webui>/oauth/oidc/callback`を含める必要があります。

以下の環境変数が使用されます：

1. `OAUTH_CLIENT_ID` - OIDCクライアントID
1. `OAUTH_CLIENT_SECRET` - OIDCクライアントシークレット
1. `OPENID_PROVIDER_URL` - OIDC well known URL（例：`https://accounts.google.com/.well-known/openid-configuration`）
1. `OAUTH_PROVIDER_NAME` - UIに表示するプロバイダー名、デフォルトはSSO
1. `OAUTH_SCOPES` - リクエストするスコープ。デフォルトは`openid email profile`

### OAuthロール管理

アクセストークン内でロールを返すように設定可能なOAuthプロバイダーであれば、Sage WebUIのロール管理に使用できます。
この機能を使用するには`ENABLE_OAUTH_ROLE_MANAGEMENT`を`true`に設定します。
OAuthプロバイダーから返されるロールに合わせて以下の環境変数を設定できます：

1. `OAUTH_ROLES_CLAIM` - ロール情報を含むクレーム。デフォルトは `roles`。ネストも可能（例: `user.roles`）。
1. `OAUTH_ALLOWED_ROLES` - ログインを許可するロールのカンマ区切りリスト（Sage WebUI ロール `user` が付与されます）。
1. `OAUTH_ADMIN_ROLES` - 管理者としてログインを許可するロールのカンマ区切りリスト（Sage WebUI ロール `admin` が付与されます）。

:::info

ログイン中のユーザーのロールを変更する場合、新しいロールを反映させるにはログアウトして再ログインする必要があります。

:::

### OAuth グループ管理

アクセストークンでグループ情報を返すように設定可能なOAuthプロバイダーを使用して、Sage Open WebUIのユーザーグループを管理できます。
この機能を利用するには `ENABLE_OAUTH_GROUP_MANAGEMENT` を `true` に設定してください。
OAuthプロバイダーから返されるグループ情報と連携するために、以下の環境変数を設定できます:

1. `OAUTH_GROUP_CLAIM` - グループ情報を含むクレーム。デフォルトは `groups`。ネストも可能（例: `user.memberOf`）。

:::warning
管理者ユーザーのグループ情報は更新されません
:::

:::info

ログイン中のユーザーのグループを変更する場合、新しいグループを反映させるにはログアウトして再ログインする必要があります。

:::

## 信頼済みヘッダー認証

Sage WebUIは、認証リバースプロキシからHTTPヘッダーで渡されるユーザー情報を使用した認証委譲が可能です。
このページではいくつかの設定例を提供しています。

:::danger

誤った設定を行うと、ユーザーがあなたのSage WebUIインスタンス上で任意のユーザーとして認証可能になる危険性があります。
認証プロキシのみがSage WebUIにアクセスできるよう、例えば `HOST=127.0.0.1` を設定してループバックインターフェースのみでリッスンするなど、適切な対策を講じてください。

:::

### 一般的な設定

`WEBUI_AUTH_TRUSTED_EMAIL_HEADER` 環境変数が設定されている場合、Sage WebUIは指定されたヘッダーの値をユーザーのメールアドレスとして使用し、自動登録とログインを処理します。

例えば、`WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-User-Email` を設定し、HTTPヘッダー `X-User-Email: example@example.com` を渡すと、メールアドレス `example@example.com` で認証されます。

オプションとして、`WEBUI_AUTH_TRUSTED_NAME_HEADER` を定義することで、信頼済みヘッダーを使用して作成されるユーザーの名前を決定できます。これは既存ユーザーには影響しません。

### Tailscale Serve

[Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) を使用すると、tailnet内でサービスを共有でき、Tailscaleはリクエスタのメールアドレスを `Tailscale-User-Login` ヘッダーに設定します。

以下は、Tailscaleサイドカーを起動するDocker Composeファイルと対応するserve設定の例です。`sage-open-webui` タグとホスト名 `sage-open-webui` でtailnetにSage WebUIを公開し、`https://sage-open-webui.TAILNET_NAME.ts.net` でアクセス可能になります。
Tailscaleコンテナに渡すために、デバイス書き込み権限のあるOAuthクライアントを `TS_AUTHKEY` として作成する必要があります。

```json title="tailscale/serve.json"
{
    "TCP": {
        "443": {
            "HTTPS": true
        }
    },
    "Web": {
        "${TS_CERT_DOMAIN}:443": {
            "Handlers": {
                "/": {
                    "Proxy": "http://sage-open-webui:8080"
                }
            }
        }
    }
}

```

```yaml title="docker-compose.yaml"
---
services:
  sage-open-webui:
    image: ghcr.io/Startr/AI-WEB-openwebui:main
    volumes:
      - sage-open-webui:/app/backend/data
    environment:
      - HOST=127.0.0.1
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login
      - WEBUI_AUTH_TRUSTED_NAME_HEADER=Tailscale-User-Name
    restart: unless-stopped
  tailscale:
    image: tailscale/tailscale:latest
    environment:
      - TS_AUTH_ONCE=true
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:sage-open-webui
      - TS_SERVE_CONFIG=/config/serve.json
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_HOSTNAME=sage-open-webui
    volumes:
      - tailscale:/var/lib/tailscale
      - ./tailscale:/config
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: unless-stopped

volumes:
  sage-open-webui: {}
  tailscale: {}
```

:::warning

TailscaleをSage WebUIと同じネットワークコンテキストで実行する場合、デフォルトではユーザーがServeプロキシを経由せず直接Sage WebUIにアクセス可能になります。
TailscaleのACLを使用して、ポート443へのアクセスのみを許可するように制限する必要があります。

:::

### Cloudflare TunnelとCloudflare Accessの連携

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/)は[Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)と組み合わせて使用でき、Sage WebUIをSSOで保護することができます。
Cloudflareによる公式ドキュメントはほとんどありませんが、`Cf-Access-Authenticated-User-Email`ヘッダーに認証済みユーザーのメールアドレスが設定されます。

以下はCloudflareサイドカーをセットアップするDocker Composeファイルの例です。
設定はダッシュボードから行います。
ダッシュボードからトンネルトークンを取得し、トンネルのバックエンドを`http://sage-open-webui:8080`に設定し、「Accessで保護」がチェックされ適切に設定されていることを確認してください。

```yaml title="docker-compose.yaml"
---
services:
  sage-open-webui:
    image: ghcr.io/Startr/AI-WEB-openwebui:main
    volumes:
      - sage-open-webui:/app/backend/data
    environment:
      - HOST=127.0.0.1
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Cf-Access-Authenticated-User-Email
    restart: unless-stopped
  cloudflared:
    image: cloudflare/cloudflared:latest
    environment:
      - TUNNEL_TOKEN=${TUNNEL_TOKEN}
    command: tunnel run
    restart: unless-stopped

volumes:
  sage-open-webui: {}

```

### oauth2-proxy

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)は、ソーシャルOAuthプロバイダーとOIDCサポートを実装した認証リバースプロキシです。

多数の設定オプションが存在するため、以下はGoogle OAuthを使用した設定例です。
詳細なセットアップや潜在的なセキュリティ上の注意点については、`oauth2-proxy`の公式ドキュメントを参照してください。

```yaml title="docker-compose.yaml"
services:
  sage-open-webui:
    image: ghcr.io/Startr/AI-WEB-openwebui:main
    volumes:
      - sage-open-webui:/app/backend/data
    environment:
      - 'HOST=127.0.0.1'
      - 'WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-Forwarded-Email'
      - 'WEBUI_AUTH_TRUSTED_NAME_HEADER=X-Forwarded-User'
    restart: unless-stopped
  oauth2-proxy:
    image: quay.io/oauth2-proxy/oauth2-proxy:v7.6.0
    environment:
      OAUTH2_PROXY_HTTP_ADDRESS: 0.0.0.0:4180
      OAUTH2_PROXY_UPSTREAMS: http://sage-open-webui:8080/
      OAUTH2_PROXY_PROVIDER: google
      OAUTH2_PROXY_CLIENT_ID: REPLACEME_OAUTH_CLIENT_ID
      OAUTH2_PROXY_CLIENT_SECRET: REPLACEME_OAUTH_CLIENT_ID
      OAUTH2_PROXY_EMAIL_DOMAINS: REPLACEME_ALLOWED_EMAIL_DOMAINS
      OAUTH2_PROXY_REDIRECT_URL: REPLACEME_OAUTH_CALLBACK_URL
      OAUTH2_PROXY_COOKIE_SECRET: REPLACEME_COOKIE_SECRET
      OAUTH2_PROXY_COOKIE_SECURE: "false"
    restart: unless-stopped
    ports:
      - 4180:4180/tcp
```

### Authentik

[Authentik](https://goauthentik.io/)のOAuthクライアントを設定するには、[アプリケーション作成方法](https://docs.goauthentik.io/docs/applications)と`OAuth2/OpenID Provider`に関するドキュメントを参照してください。
許可されるリダイレクトURIには`<sage-open-webui>/oauth/oidc/callback`を含める必要があります。

プロバイダー作成時には、`App-name`、`Client-ID`、`Client-Secret`をメモし、それらをsage-open-webuiの環境変数として使用してください：

```
      - 'ENABLE_OAUTH_SIGNUP=true'
      - 'OAUTH_MERGE_ACCOUNTS_BY_EMAIL=true'
      - 'OAUTH_PROVIDER_NAME=Authentik'
      - 'OPENID_PROVIDER_URL=https://<authentik-url>/application/o/<App-name>/.well-known/openid-configuration'
      - 'OAUTH_CLIENT_ID=<Client-ID>'
      - 'OAUTH_CLIENT_SECRET=<Client-Secret>'
      - 'OAUTH_SCOPES=openid email profile'
      - 'OPENID_REDIRECT_URI=https://<sage-open-webui>/oauth/oidc/callback'
```

### Authelia

[Authelia](https://www.authelia.com/)は、信頼済みヘッダー認証で使用するヘッダーを返すように設定できます。
設定方法については[こちら](https://www.authelia.com/integration/trusted-header-sso/introduction/)のドキュメントを参照してください。

Autheliaのデプロイは複雑なため、設定例は提供していません。