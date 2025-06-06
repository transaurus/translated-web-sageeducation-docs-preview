### Let's Encrypt

Let's Encryptは、ほとんどのブラウザで信頼されている無料のSSL証明書を提供し、本番環境に最適です。

#### 前提条件

- システムに**Certbot**がインストールされていること。
- DNSレコードがサーバーを指すように正しく設定されていること。

#### 手順

1. **Nginxファイル用のディレクトリを作成:**

    ```bash
    mkdir -p conf.d ssl
    ```

2. **Nginx設定ファイルを作成:**

    **`conf.d/sage-open-webui.conf`:**

    ```nginx
    server {
        listen 80;
        server_name your_domain_or_IP;

        location / {
            proxy_pass http://host.docker.internal:3000;
    
            # WebSocketサポートを追加（バージョン0.5.0以降で必要）
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # （オプション）モデルからのストリーミングレスポンスを向上させるためプロキシバッファリングを無効化
            proxy_buffering off;
        }
    }
    ```

3. **Let's Encryptスクリプトの簡易版:**

    **`enable_letsencrypt.sh`:**

    ```bash
    #!/bin/bash

    # 説明: Certbotを使用してLet's Encrypt SSL証明書を取得・インストールする簡易スクリプト。

    DOMAIN="your_domain_or_IP"
    EMAIL="your_email@example.com"

    # Certbotがインストールされていない場合にインストール
    if ! command -v certbot &> /dev/null; then
        echo "Certbotが見つかりません。インストール中..."
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    fi

    # SSL証明書を取得
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

    # 変更を適用するためNginxをリロード
    sudo systemctl reload nginx

    echo "Let's Encrypt SSL証明書がインストールされ、Nginxがリロードされました。"
    ```

    **スクリプトを実行可能にする:**

    ```bash
    chmod +x enable_letsencrypt.sh
    ```

4. **Docker Compose設定を更新:**

    `docker-compose.yml`にNginxサービスを追加:

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./conf.d:/etc/nginx/conf.d
          - ./ssl:/etc/nginx/ssl
        depends_on:
          - sage-open-webui
    ```

5. **Nginxサービスを起動:**

    ```bash
    docker compose up -d nginx
    ```

6. **Let's Encryptスクリプトを実行:**

    SSL証明書を取得・インストールするためスクリプトを実行:

    ```bash
    ./enable_letsencrypt.sh
    ```

#### WebUIへのアクセス

Sage WebUIにはHTTPSでアクセス:

[https://your_domain_or_IP](https://your_domain_or_IP)