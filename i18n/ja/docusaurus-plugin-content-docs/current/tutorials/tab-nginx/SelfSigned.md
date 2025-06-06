### 自己署名証明書

自己署名証明書の使用は、信頼性が重要でない開発環境や内部利用に適しています。

#### 手順

1. **Nginx用ディレクトリの作成:**

    ```bash
    mkdir -p conf.d ssl
    ```

2. **Nginx設定ファイルの作成:**

    **`conf.d/sage-open-webui.conf`:**

    ```nginx
    server {
        listen 443 ssl;
        server_name your_domain_or_IP;

        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;

        location / {
            proxy_pass http://host.docker.internal:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # (オプション) モデルからのストリーミングレスポンスを向上させるためプロキシバッファリングを無効化
            proxy_buffering off;
        }
    }
    ```

3. **自己署名SSL証明書の生成:**

    ```bash
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/nginx.key \
    -out ssl/nginx.crt \
    -subj "/CN=your_domain_or_IP"
    ```

4. **Docker Compose設定の更新:**

    `docker-compose.yml`にNginxサービスを追加:

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        ports:
          - "443:443"
        volumes:
          - ./conf.d:/etc/nginx/conf.d
          - ./ssl:/etc/nginx/ssl
        depends_on:
          - sage-open-webui
    ```

5. **Nginxサービスの起動:**

    ```bash
    docker compose up -d nginx
    ```

#### WebUIへのアクセス

HTTPS経由でSage WebUIにアクセス:

[https://your_domain_or_IP](https://your_domain_or_IP)

---